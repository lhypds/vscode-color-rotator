
VS Code Window Color Rotator
============================


Rotate to use a different color for VS Code window in different projects.  

![Mar-20-2026 18-01-12](https://github.com/user-attachments/assets/f271aa37-f14e-4529-b61f-65b47474c0e1)


Installation
------------

Search `Window Color Rotator` in the VS Code extension marketplace and install it.  

* Uninstall  
Uninstall the extension from the VS Code extension marketplace.  
Remove the `workbench.colorCustomizations` field in the `.vscode/settings.json` file.  


Quick Start
-----------

Status bar button  
Click the `Rotate Color` button in the status bar to rotate the color for the current project window.  
It can remember a color for each project (path).  

Command palette  
Press Ctrl + Shift + P, then type `Window Color Rotator` to trigger the command.  
Support commands:  
`Window Color Rotator: Rotate` to rotate the color for the current project window.  
`Window Color Rotator: Clear` to clear the color for the current project window.  
`Window Color Rotator: Reset All` to clear the colors for all projects.  
`Window Color Rotator: Customize Colors` to customize the colors in the color configuration file.  


How It Works
------------

Basically it writes a custom color into `.vscode/.settings.json` file `workbench.colorCustomizations` field in the project folder.  

When rotating color, it will choose a color from the color configuration file (`colors.json`), and write the color to `.vscode/settings.json` file. It will save the project path to color configuration file (`colors.json`).  

Everytime when user opens a project, it will check the project path in the color configuration file (`colors.json`), if there is a color associated with the project path, it will load the color to `.vscode/settings.json` file.  

Functions:

1. Rotate color  
To rotate the color for the current project window.  
Use command:  
`Window Color Rotator: Rotate`.  
It will rotate and choose a color for the current project window from the `colors.json`, and write the color to `.vscode/settings.json` file. It will save the project path to color configuration file (`colors.json`).   

2. Clear color  
Clear the color for the current project window, both in `.vscode/settings.json` and in color configuration file (`colors.json`).  
Use command:  
`Window Color Rotator: Clear`.  

3. Reset all  
Clear the colors for all projects, for both in current project `.vscode/settings.json` and in color configuration file (`colors.json`).  
It will re-initialize the color configuration file from example file (`colors.json.example` or `colors.dark.json.example`).  
All the colors and project paths will be cleared.  
Use command:  
`Window Color Rotator: Reset All`.  


Customize Colors
----------------

You can edit colors configuration file (`colors.json`) to add your customized colors.  
Use command:  
`Window Color Rotator: Customize Colors` to open the color configuration file.

File location  
The color configuration file is in the extension's global storage:  
`~/Library/Application Support/Code/User/globalStorage/gcc3.vscode-color-rotator/colors.json`.  
Manually open the file and edit it to customize the colors will also work.  

File structure and fields  
`colors.json` stores the colors and the project paths, one color can be associated with multiple projects.  
Field `workbench.colorCustomizations` is the color setting, it will be copied to the `.vscode/settings.json`.  
Filed `projectPath` is an array of project paths that are associated with the color.  

Color example with fields description:  
```json
{
    "colorName": "pink",  // color name, just for reference
    "color": "#ffeaea",  // primary color, just for reference
    "workbench.colorCustomizations": {
        "titleBar.activeBackground": "#ffeaea",  // title bar active background color
        "titleBar.inactiveBackground": "#ffeaea",  // title bar inactive background color
        "titleBar.activeForeground": "#1e1e1e",  // title bar active foreground color
        "titleBar.inactiveForeground": "#6d6c6f",  // title bar inactive foreground color
        "statusBar.background": "#ffeaea",  // status bar background color
        "statusBar.foreground": "#1e1e1e",  // status bar foreground color
    },
    "projectPath": []  // array of project paths that are associated with the color
}
```


Local Execution
---------------

Clone the source code into the project's `.vscode` folder.  
Run `setup.sh` to install dependencies.  
For local execution, `colors.json` file is in the cloned folder.  

Scripts:  
`rotate.sh` to rotate window color.  
`clear.sh` to clear window color.  
`load.sh` to load the color from `colors.json` for current project.  
`resetall.sh [light|dark]` to reset all window colors.  
