import * as vscode from 'vscode';
import { rotateColor, loadColor } from './color-rotator';

export function activate(context: vscode.ExtensionContext): void {
  const extensionPath = context.extensionPath;

  const rotateDisposable = vscode.commands.registerCommand(
    'vscode-color-rotator.rotate',
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
    'vscode-color-rotator.load',
    () => {
      const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!projectPath) {
        vscode.window.showInformationMessage('No workspace folder is open.');
        return;
      }
      loadColor(projectPath, extensionPath);
    }
  );

  context.subscriptions.push(rotateDisposable, loadDisposable);
}

export function deactivate(): void {}
