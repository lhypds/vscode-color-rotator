import * as fs from 'fs';
import * as path from 'path';

const VERSION = '1.0.0';
console.log(`vscode-color-rotator v${VERSION}`);

interface ColorCustomizations {
  [key: string]: string;
}

interface ColorEntry {
  name?: string;
  projectPath?: string[];
  'workbench.colorCustomizations': ColorCustomizations;
}

type ColorsJson = ColorEntry[] | { [name: string]: Omit<ColorEntry, 'name'> };

export function rotateColor(projectPath: string, currentDir: string): void {
  // Ensure `.vscode`
  const dotVscodePath = path.join(projectPath, '.vscode');
  if (
    !fs.existsSync(dotVscodePath) ||
    !fs.statSync(dotVscodePath).isDirectory()
  ) {
    // Create `.vscode` folder if it doesn't exist
    fs.mkdirSync(dotVscodePath);
    console.log('`.vscode` folder created.');
  }

  // Ensure `settings.json`
  const settingsPath = path.join(dotVscodePath, 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, '{}\n', 'utf-8');
    console.log(`Created ${settingsPath}`);
  }

  // Load `settings.json`
  let settingsJson: Record<string, unknown>;
  try {
    const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
    settingsJson = JSON.parse(settingsContent);
  } catch {
    console.log(`Error: ${settingsPath} contains invalid JSON.`);
    return;
  }
  console.log('`settings.json` found and loaded.');

  // Load `colors.json`
  const colorsPath = path.join(currentDir, 'colors.json');
  if (!fs.existsSync(colorsPath)) {
    console.log('`colors.json` not found.');

    // Create a `colors.json` from `colors.json.example`.
    const examplePath = path.join(currentDir, 'colors.json.example');
    fs.copyFileSync(examplePath, colorsPath);
    console.log('Created `colors.json` from `colors.json.example`.');
  }
  let colorsJson: ColorsJson;
  try {
    const colorsContent = fs.readFileSync(colorsPath, 'utf-8');
    colorsJson = JSON.parse(colorsContent);
  } catch {
    console.log(`Error: ${colorsPath} contains invalid JSON.`);
    return;
  }

  // Normalize: support both a list of color objects and a dict keyed by name
  let colorsList: ColorEntry[];
  if (Array.isArray(colorsJson)) {
    colorsList = colorsJson;
  } else if (typeof colorsJson === 'object' && colorsJson !== null) {
    colorsList = Object.entries(colorsJson).map(([name, value]) => ({
      name,
      ...value
    }));
  } else {
    console.log(`Error: ${colorsPath} has an unexpected format.`);
    return;
  }
  console.log(`\`colors.json\` loaded. ${colorsList.length} color(s) found.`);

  // Ensure every entry has a projectPath field
  for (const entry of colorsList) {
    if (entry.projectPath === undefined) {
      entry.projectPath = [];
    }
  }

  // Randomly rotate to choose a color from `colors.json`
  if (colorsList.length === 0) {
    console.log(`Error: ${colorsPath} does not contain any colors.`);
    return;
  }

  // Clear this project from any entry it was previously assigned to,
  // and remember it to avoid re-picking the same color
  let previousColor: ColorEntry | undefined;
  for (const entry of colorsList) {
    if (entry.projectPath?.includes(projectPath)) {
      previousColor = entry;
      entry.projectPath = entry.projectPath.filter(p => p !== projectPath);
    }
  }

  // Pick from colors not currently assigned to this project and not the previously used color
  // (multiple projects may share the same color)
  const availableColors = colorsList.filter(
    entry =>
      !entry.projectPath?.includes(projectPath) && entry !== previousColor
  );
  if (availableColors.length === 0) {
    console.log('Error: No available colors (all assigned to other projects).');
    return;
  }

  const chosenColor =
    availableColors[Math.floor(Math.random() * availableColors.length)];
  console.log(
    `Chosen color: ${chosenColor['workbench.colorCustomizations']['titleBar.activeBackground']}`
  );

  // Update the `colors.json` projectPath (append this project to the array)
  (chosenColor.projectPath ??= []).push(projectPath);
  if (Array.isArray(colorsJson)) {
    const idx = colorsList.indexOf(chosenColor);
    (colorsJson as ColorEntry[])[idx] = chosenColor;
  }
  fs.writeFileSync(
    colorsPath,
    JSON.stringify(colorsJson, null, 2) + '\n',
    'utf-8'
  );
  console.log(`Updated projectPath in \`colors.json\`.`);

  // Add or replace `workbench.colorCustomizations` in `settings.json`
  settingsJson['workbench.colorCustomizations'] =
    chosenColor['workbench.colorCustomizations'];
  fs.writeFileSync(
    settingsPath,
    JSON.stringify(settingsJson, null, 2) + '\n',
    'utf-8'
  );
  console.log('Color updated to `workbench.colorCustomizations`.');
}

export function loadColor(projectPath: string, currentDir: string): void {
  // Load `colors.json`
  const colorsPath = path.join(currentDir, 'colors.json');
  if (!fs.existsSync(colorsPath)) {
    console.log('`colors.json` not found.');
    return;
  }
  let colorsJson: ColorsJson;
  try {
    const colorsContent = fs.readFileSync(colorsPath, 'utf-8');
    colorsJson = JSON.parse(colorsContent);
  } catch {
    console.log(`Error: ${colorsPath} contains invalid JSON.`);
    return;
  }

  // Normalize: support both a list of color objects and a dict keyed by name
  let colorsList: ColorEntry[];
  if (Array.isArray(colorsJson)) {
    colorsList = colorsJson;
  } else if (typeof colorsJson === 'object' && colorsJson !== null) {
    colorsList = Object.entries(colorsJson).map(([name, value]) => ({
      name,
      ...value
    }));
  } else {
    console.log(`Error: ${colorsPath} has an unexpected format.`);
    return;
  }

  // Find the color assigned to this project
  const assignedColor = colorsList.find(entry =>
    entry.projectPath?.includes(projectPath)
  );
  if (!assignedColor) {
    console.log(`No color assigned to project: ${projectPath}`);
    return;
  }
  console.log(
    `Found color: ${assignedColor['workbench.colorCustomizations']['titleBar.activeBackground']}`
  );

  // Ensure `.vscode`
  const dotVscodePath = path.join(projectPath, '.vscode');
  if (
    !fs.existsSync(dotVscodePath) ||
    !fs.statSync(dotVscodePath).isDirectory()
  ) {
    fs.mkdirSync(dotVscodePath);
    console.log('`.vscode` folder created.');
  }

  // Ensure `settings.json`
  const settingsPath = path.join(dotVscodePath, 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, '{}\n', 'utf-8');
    console.log(`Created ${settingsPath}`);
  }

  // Load `settings.json`
  let settingsJson: Record<string, unknown>;
  try {
    const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
    settingsJson = JSON.parse(settingsContent);
  } catch {
    console.log(`Error: ${settingsPath} contains invalid JSON.`);
    return;
  }

  // Apply the color to `settings.json`
  settingsJson['workbench.colorCustomizations'] =
    assignedColor['workbench.colorCustomizations'];
  fs.writeFileSync(
    settingsPath,
    JSON.stringify(settingsJson, null, 2) + '\n',
    'utf-8'
  );
  console.log('Color loaded to `workbench.colorCustomizations`.');
}

export function clearColor(projectPath: string, currentDir: string): void {
  // Load `colors.json` and clear the projectPath assignment for this project
  const colorsPath = path.join(currentDir, 'colors.json');
  if (fs.existsSync(colorsPath)) {
    let colorsJson: ColorsJson;
    try {
      const colorsContent = fs.readFileSync(colorsPath, 'utf-8');
      colorsJson = JSON.parse(colorsContent);
    } catch {
      console.log(`Error: ${colorsPath} contains invalid JSON.`);
      return;
    }

    let cleared = false;
    if (Array.isArray(colorsJson)) {
      for (const entry of colorsJson) {
        if (entry.projectPath?.includes(projectPath)) {
          entry.projectPath = entry.projectPath.filter(p => p !== projectPath);
          cleared = true;
        }
      }
      if (cleared) {
        fs.writeFileSync(
          colorsPath,
          JSON.stringify(colorsJson, null, 2) + '\n',
          'utf-8'
        );
        console.log('Cleared projectPath assignment in `colors.json`.');
      }
    } else if (typeof colorsJson === 'object' && colorsJson !== null) {
      for (const value of Object.values(colorsJson)) {
        const entry = value as ColorEntry;
        if (entry.projectPath?.includes(projectPath)) {
          entry.projectPath = entry.projectPath.filter(p => p !== projectPath);
          cleared = true;
        }
      }
      if (cleared) {
        fs.writeFileSync(
          colorsPath,
          JSON.stringify(colorsJson, null, 2) + '\n',
          'utf-8'
        );
        console.log('Cleared projectPath assignment in `colors.json`.');
      }
    }
    if (!cleared) {
      console.log(`No color was assigned to project: ${projectPath}`);
    }
  } else {
    console.log('`colors.json` not found, nothing to clear.');
  }

  // Remove `workbench.colorCustomizations` from `settings.json`
  const settingsPath = path.join(projectPath, '.vscode', 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    console.log('`settings.json` not found, nothing to clear.');
    return;
  }
  let settingsJson: Record<string, unknown>;
  try {
    const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
    settingsJson = JSON.parse(settingsContent);
  } catch {
    console.log(`Error: ${settingsPath} contains invalid JSON.`);
    return;
  }

  if ('workbench.colorCustomizations' in settingsJson) {
    delete settingsJson['workbench.colorCustomizations'];
    fs.writeFileSync(
      settingsPath,
      JSON.stringify(settingsJson, null, 2) + '\n',
      'utf-8'
    );
    console.log(
      'Removed `workbench.colorCustomizations` from `settings.json`.'
    );
  } else {
    console.log('`workbench.colorCustomizations` not set, nothing to remove.');
  }
}

// Resolve paths
const currentDir = path.dirname(path.resolve(__filename));
const dotVscodePath = path.dirname(currentDir);

// Ensure `.vscode`
if (path.basename(dotVscodePath) !== '.vscode') {
  console.log(
    'Parent folder is not `.vscode`, please clone project inside a `.vscode` folder.'
  );
} else {
  console.log('`.vscode` folder found.');

  // Project path (one level above `.vscode`)
  const projectPath = path.dirname(dotVscodePath);
  console.log(`Project path: ${projectPath}`);

  const command = process.argv[2];
  if (command === 'load') {
    loadColor(projectPath, currentDir);
  } else if (command === 'clear') {
    clearColor(projectPath, currentDir);
  } else if (command === 'rotate' || !command) {
    rotateColor(projectPath, currentDir);
  } else {
    console.log(
      `Unknown command: "${command}". Use "rotate", "load", or "clear".`
    );
  }
}
