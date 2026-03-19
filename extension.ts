import * as vscode from 'vscode';
import {
  rotateColor,
  loadColor,
  clearColor,
  resetColors
} from './color-rotator';

export function activate(context: vscode.ExtensionContext): void {
  const extensionPath = context.extensionPath;

  const rotateDisposable = vscode.commands.registerCommand(
    'window-color-rotator.rotate',
    () => {
      const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!projectPath) {
        vscode.window.showInformationMessage('No workspace folder is open.');
        return;
      }
      rotateColor(projectPath, extensionPath);
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
      clearColor(projectPath, extensionPath);
    }
  );

  const resetAllDisposable = vscode.commands.registerCommand(
    'window-color-rotator.resetall',
    () => {
      const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!projectPath) {
        vscode.window.showInformationMessage('No workspace folder is open.');
        return;
      }
      resetColors(projectPath, extensionPath);
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
    loadColor(projectPath, extensionPath);
  }
}

export function deactivate(): void {}
