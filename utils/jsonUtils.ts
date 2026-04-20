import * as fs from 'fs';
import JSON5 from 'json5';

export function readJson<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON5.parse(content) as T;
}
