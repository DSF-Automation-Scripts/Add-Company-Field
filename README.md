# Add Company Field
## **Intro**
This script is designed to take an identifier that should be replaced with a company selection instead, and remove the identifier while adding the company

## **Installation**
This script relies on the following libraries to work:
- [Puppeteer](https://pptr.dev/)
- [File System](https://nodejs.org/api/fs.html)

Installation of all libraries will be the same once Node js is installed. To install Node js, simply navigate to the [following website](https://nodejs.org/en/download/) and install the appropriate version of the installer. Afterwards, you should have a Node js console as an exe on your computer, and you can run node commands from it. To install different libraries, simply type "npm i \<library name\>." In order to install all these libraries, the following commands should be run:
- npm i puppeteer
- npm i fs

After Node js and both libraries are installed, you should be able to navigate into the directory of the downloaded code using the Node js console, and type "node ./run.js" to execute the script. 

## **Code Overview**
The code is broken into 3 main sections, with the last section being further broken into 4 sections

### **run.js**
The main body of code, where the entirety of the logic for the script is stored

#### **Dependents**
Importing the necessary code into the script.

1. puppeteer: The Google library being used to navigate the web
2. fs: Library used to write files
4. constants: The script expects a file of constants which includes all element and file paths
5. credentials: The script also expects both a username and password to be provided in a seperate file (not included for security purposes)

Potential changes required: likely none, unless new libraries need to be used to add functionality

#### **Functions**
The functions used to assist the script

1. getMessageWithTime: A function that takes a message in the form of a variable, and prepends the date and time to it
2. logToConsoleAndLog: A function that takes a message (typically already prepended with the date and time) and logs it to both the temporary local console, and to a more permanent log
3. waitForLoad: A function to wait for DSF to load
4. login: A function to execute the login code, allowing it to be run multiple times instead
5. evalResults: A function to iterate through a page of DSF results, performing some actions on each product it enters
6. chooseCompany: A function to execute the code to choose the company on the product tab, allowing this code to be run in a loop instead of only one time
7. run: Base script to execute the script

Potential changes required: likely none, unless new functions are needed to assist script updates

#### **Main Program**
The main logic the script will follow to perform the task given to it, further documented inside of the code

### **constants.js**
Any constant that is used by the script. These should be documented well inside the code, but references are provided here for confusing elements just in case. This file will require moderate modification in the form of HTML element path's changing, and new constants being added. If an element doesn't seem to be working, it could be caused by a mismatch of paths. To find the path for an element, simply open the page it appears on, navigate to developer tools (usually F11 or ctrl + i) and find the element in the source. (there is usually an option to click on an element as well.) From here, simply right click on the element, go to copy, and select "copy selector" Paste this into the constants page with the desired identifier. This will change the path Puppeteer looks for everywhere that path is referenced. Certain paths must be filled in before the script will work at all, namely URL.

1. URL: The URL of the home page of DSF. This page should allow a login and access to the administration tab.

### **credentials.js**
The script will look to this file to find the username and password to log in to DSF. Both will need to be changed before the script can work.

## Development Info
This script was developed by Max Ostenson while working at BYU Print and Mail. Any questions or bugs can be directed to max.ostenson@gmail.com
