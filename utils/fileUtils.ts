import * as fs from 'fs';

export function ensureFile(path: string, defaultContent: string): void {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, defaultContent, 'utf-8');
    console.log(`Created ${path}`);
  }
}
