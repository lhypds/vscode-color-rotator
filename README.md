
VS Code Window Color Rotator
============================


Rotate to use a different color for VSCode window in different projects.  


Quick Start
-----------

Press Ctrl + Shift + P, then type `Window Color Rotator` to trigger the command.  
It can remember a color for each project.  


How It Works
------------

Basically it writes a custom color into `.vscode/.settings.json` file. (`workbench.colorCustomizations`).  

Rotate color  
To rotate the color for the current project.  
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

The color configuration file is at `~/.vscode/extensions/gcc3.vscode-color-rotator/colors.json`.  


Local Execution
---------------

Clone the source code into the project's `.vscode` folder.  
Run `setup.sh` to install dependencies.  

Scripts:  
`rotate.sh` to rotate window color.  
`clear.sh` to clear window color.  
`load.sh` to load the color for current project.  
`resetall.sh` to reset all window colors.  
