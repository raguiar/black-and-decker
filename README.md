# black-and-decker
Utilities

Node.Js app that reads several excel files and extracts specified cell contents into a summary excel file.

To create a Desktop Application using Node-Webkit:
1. Zip all the content of Excelister 
2. Change the extension of the '.zip' to '.nw'
3. On Windows, having Node-Webkit installed, run the following:
      copy /b nw.exe+<path to renamed .nw file>\<name of .nw file> <desired exe filename.exe>
4. For the executable to work, NW dat and pak files should also be copied to the same folder
  

How to use the application:    
The origin and destination excel files, and cell addresses are specified in a config.xlsx, which must be placed in the same folder as the executable
Run the application
Click on 'Processar'
A 'Terminado' green button means it ended successfully. Find your output file where you specified it would be.


TODO:
Show the config information on the screen and allow it to be edited and saved 
Set the backgound to the NASA APOD :) with some transparency


