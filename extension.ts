import * as vscode from 'vscode';
import {
  rotateColor,
  loadColor,
  clearColor,
  resetColors
} from './color-rotator';

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const extensionPath = context.extensionPath;

  // Ensure the global storage directory exists
  const userStoragePath = context.globalStorageUri.fsPath;
  try {
    await vscode.workspace.fs.stat(context.globalStorageUri);
  } catch {
    await vscode.workspace.fs.createDirectory(context.globalStorageUri);
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
      const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!projectPath) {
        vscode.window.showInformationMessage('No workspace folder is open.');
        return;
      }

      // Show a confirmation dialog before resetting all colors
      const confirmLabel = 'Reset';
      const confirmation = await vscode.window.showWarningMessage(
        'This will reset color for all workspaces. Continue?',
        { modal: true },
        confirmLabel
      );
      if (confirmation !== confirmLabel) {
        return;
      }

      resetColors(projectPath, extensionPath, userStoragePath);
    }
  );

  context.subscriptions.push(
    rotateDisposable,
    clearDisposable,
    resetAllDisposable
  );

  // Run loadColor on activation to apply the color for the current project
  const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (projectPath) {
    loadColor(projectPath, extensionPath, userStoragePath);
  }
}

export function deactivate(): void {}
