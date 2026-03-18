import * as vscode from 'vscode';
import { rotateColor, loadColor, clearColor } from './color-rotator';

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

  const loadDisposable = vscode.commands.registerCommand(
    'window-color-rotator.load',
    () => {
      const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!projectPath) {
        vscode.window.showInformationMessage('No workspace folder is open.');
        return;
      }
      loadColor(projectPath, extensionPath);
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

  context.subscriptions.push(rotateDisposable, loadDisposable, clearDisposable);
}

export function deactivate(): void {}
