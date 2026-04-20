import * as vscode from 'vscode';

export async function uriExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(uri: vscode.Uri): Promise<void> {
  if (!(await uriExists(uri))) {
    await vscode.workspace.fs.createDirectory(uri);
  }
}
