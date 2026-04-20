import * as fs from 'fs';
import * as vscode from 'vscode';
import { rotateColor, loadColor, clearColor } from './color-rotator';
import { readJson } from './utils/jsonUtils';
import { ensureDirectory, uriExists } from './utils/vscodeUtils';

interface ColorEntry {
  projectPath?: string[];
}

type ColorsJson = ColorEntry[] | { [name: string]: ColorEntry };

async function initializeColorConfiguration(
  context: vscode.ExtensionContext,
  colorsFileUri: vscode.Uri
): Promise<void> {
  // Show a command-palette style confirmation before resetting all colors
  const lightOrDark = await vscode.window.showQuickPick(['Light', 'Dark'], {
    placeHolder: 'Prefer light or dark theme?',
    ignoreFocusOut: true
  });

  // Read from example and write to `colors.json`
  const exampleColorsContent = await vscode.workspace.fs.readFile(
    vscode.Uri.joinPath(
      context.extensionUri,
      lightOrDark === 'Dark'
        ? 'colors.dark.json.example'
        : 'colors.json.example'
    )
  );
  await vscode.workspace.fs.writeFile(colorsFileUri, exampleColorsContent);

  // Clear the current project color in `.vscode/settings.json`
  loadColor(
    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
    context.extensionPath,
    context.globalStorageUri.fsPath
  );
}

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const extensionPath = context.extensionPath;

  // Ensure the global storage directory exists
  const userStoragePath = context.globalStorageUri.fsPath;
  await ensureDirectory(context.globalStorageUri);

  // Initialize the colors.json file if it doesn't exist
  const colorsFileUri = vscode.Uri.joinPath(
    context.globalStorageUri,
    'colors.json'
  );
  if (!(await uriExists(colorsFileUri))) {
    console.log('`colors.json` not found, creating from example...');

    // Popup a warning message at the right bottom corner
    const initializeButton = 'Initialize `colors.json`';
    vscode.window
      .showWarningMessage(
        'Color configuration file (`colors.json`) not found. Please initialize.',
        initializeButton
      )
      .then(async selection => {
        if (selection === initializeButton) {
          await initializeColorConfiguration(context, colorsFileUri);
        }
      });
  }

  // When active, check the `colors.json`
  // Clean up any non-existing folders in the `projectPath` for each color entry
  // Loop through the projectPath for each color, if the folder not exist, remove it from the projectPath
  if (await uriExists(colorsFileUri)) {
    try {
      const colorsJson = readJson<ColorsJson>(colorsFileUri.fsPath);
      let changed = false;

      const removeMissingPaths = (entry: ColorEntry): void => {
        const projectPaths = entry.projectPath;
        if (!projectPaths) {
          return;
        }

        const filtered = projectPaths.filter(folderPath =>
          fs.existsSync(folderPath)
        );
        if (filtered.length !== projectPaths.length) {
          entry.projectPath = filtered;
          changed = true;
        }
      };

      if (Array.isArray(colorsJson)) {
        for (const entry of colorsJson) {
          removeMissingPaths(entry);
        }
      } else if (typeof colorsJson === 'object' && colorsJson !== null) {
        for (const entry of Object.values(colorsJson)) {
          removeMissingPaths(entry);
        }
      }

      if (changed) {
        await vscode.workspace.fs.writeFile(
          colorsFileUri,
          Buffer.from(JSON.stringify(colorsJson, null, 2) + '\n', 'utf-8')
        );
        console.log(
          'Removed non-existing folders from `projectPath` in `colors.json`.'
        );
      }
    } catch {
      console.log(`Error: ${colorsFileUri.fsPath} contains invalid JSON.`);
      vscode.window.showWarningMessage(
        'Skipped cleanup: `colors.json` contains invalid JSON.'
      );
    }
  }

  const rotateDisposable = vscode.commands.registerCommand(
    'window-color-rotator.rotate',
    () => {
      const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!projectPath) {
        vscode.window.showInformationMessage('No workspace folder is open.');
        return;
      }
      rotateColor(projectPath, extensionPath, userStoragePath);
    }
  );

  const clearDisposable = vscode.commands.registerCommand(
    'window-color-rotator.clear',
    () => {
      const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!projectPath) {
        vscode.window.showInformationMessage('No workspace folder is open.');
        return;
      }
      clearColor(projectPath, extensionPath, userStoragePath);
    }
  );

  const resetAllDisposable = vscode.commands.registerCommand(
    'window-color-rotator.resetall',
    async () => {
      // Popup a warning message at the right bottom corner
      const initializeButton = 'Reset all and re-initialize `colors.json`';
      vscode.window
        .showWarningMessage(
          'Warning: this will reset colors for all project windows.',
          initializeButton
        )
        .then(async selection => {
          if (selection === initializeButton) {
            await initializeColorConfiguration(context, colorsFileUri);
          }
        });
    }
  );

  const customizeDisposable = vscode.commands.registerCommand(
    'window-color-rotator.customize',
    () => {
      // Open the `colors.json` file in the user's global storage directory
      const colorsFileUri = vscode.Uri.joinPath(
        context.globalStorageUri,
        'colors.json'
      );
      vscode.workspace.openTextDocument(colorsFileUri).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  );

  const rotateStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  rotateStatusBarItem.text = '$(sync) Rotate Color';
  rotateStatusBarItem.tooltip = 'Window Color Rotator';
  rotateStatusBarItem.command = 'window-color-rotator.rotate';
  rotateStatusBarItem.show();

  context.subscriptions.push(
    rotateDisposable,
    clearDisposable,
    resetAllDisposable,
    customizeDisposable,
    rotateStatusBarItem
  );

  // Run loadColor on activation to apply the color for the current project
  const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (projectPath) {
    loadColor(projectPath, extensionPath, userStoragePath);
  }
}

export function deactivate(): void {}
