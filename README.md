
VS Code Window Color Rotator
============================


Rotate to use a different color for VS Code window in different projects.  


Quick Start
-----------

Click the `Rotate Color` button in the status bar to rotate the color for the current project window.  
It can remember a color for each project (path).  


Command Palette
---------------

Press Ctrl + Shift + P, then type `Window Color Rotator` to trigger the command.  

Support commands:  
- `Window Color Rotator: Rotate` to rotate the color for the current project window.  
- `Window Color Rotator: Clear` to clear the color for the current project window.  
- `Window Color Rotator: Reset All` to clear the colors for all projects.  
- `Window Color Rotator: Customize Colors` to customize the colors in the color configuration file.  


How It Works
------------

Basically it writes a custom color into `.vscode/.settings.json` file. (`workbench.colorCustomizations` field).  

Rotate color  
To rotate the color for the current project window.  
Use command:  
`Window Color Rotator: Rotate`.  
It will rotate and choose a color for the current project window, and write the color to `settings.json` file.  
And save the project path to the color to `colors.json` file.   

Clear color  
To clear the color for the current project window for both in `settings.json` and in color configuration file (`colors.json`).  
Use command:  
`Window Color Rotator: Clear`.  

Reset all  
To clear the colors for all projects, for both in `settings.json` and in color configuration file (`colors.json`).  
Use command:  
`Window Color Rotator: Reset All`.  


Customize Colors
----------------

You can edit colors configuration file (`colors.json`) to customize the colors.  
Use command:  
`Window Color Rotator: Customize Colors` to open the color configuration file.

File Location  
The color configuration file is in the extension's global storage:  
`~/Library/Application Support/Code/User/globalStorage/gcc3.vscode-color-rotator/colors.json`.  

File Structure  
`colors.json` stores the colors and the project paths, one color can be associated with multiple projects.  

Fields  
Field `workbench.colorCustomizations` is the color setting, it will be copied to the `settings.json` in `.vscode` folder.  
Filed `projectPath` is an array of project paths that are associated with the color.  

Color Example:  
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

Scripts:  
`rotate.sh` to rotate window color.  
`clear.sh` to clear window color.  
`load.sh` to load the color for current project.  
`resetall.sh` to reset all window colors.  

For local execution, `colors.json` file is in the cloned folder.  
