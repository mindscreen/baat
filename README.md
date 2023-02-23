# BAAT ![BAAT Logo](./assets/Logo-small.svg)

BAAT is a small software tool that facilitates automated accessibility checks on website, it utilizes axe-core in order to carry out the accessibility check quickly.
BAAT offers convenient alternatives to traditional accessibility checks; it can either be ran as a bookmarklet or as a userscript, thus enabling the usage of BAAT in cases where installations are not allowed on the machine. 
With BAAT, users can obtain precise and automatic accessibilty analysis results, making BAAT an useful tool for any organization dedicated to accessible website development.

- 🌎 [Project website](https://mscr.it/baat/)
- 🌎 [Axe Core](https://github.com/dequelabs/axe-core)

## Installation

In order to install BAAT head to the [releases page](https://github.com/mindscreen/baat/releases/latest) and download the bookmarklet.txt. 
Then create a new bookmark in your browser and paste the content of the bookmarklet.txt into the URL field.
The creation of a bookmarklet is browser specific, so please refer to your browser's documentation for further information.

It is also possible to install BAAT as an userscript. In order for this to work you will need to install a userscript manager, such as [Tampermonkey](https://www.tampermonkey.net/).
Once you have installed the userscript manager, you can install the userscript.js from the [releases page](https://github.com/mindscreen/baat/releases/latest).

## Usage

1. Go to the website you want to test.
2. Use the bookmarklet to activate the interface.
3. Click the "Select File" Button under Testscript
4. If autorun is activated, the test will start automatically. Otherwise, click the "Run Test" Button.
5. This will take a few seconds. The results will be shown in the "Results" section.

![BAAT view after successfully run](./assets/BAAT-Run.jpg)

After axe-core has finished the test you will be taken to the results section. 
Here you can inspect the different issues. The Findings are grouped by Issue as elements which can be expanded by clicking on them.
The element contains the Name of the Issue, which kind of issue it is and the impact. In the top right corner you can find an icon that displays the impact of the issue.
If you expand the Issue you will see a longer description. You will also see a list of the elements that are affected by the issue.
By clicking on a link in the list you will scroll to the element in the website.

### Options

#### Issue Impact Filters

The Issue Impact filters control which issues are shown in the results. The default is to show only serious or critical issues.

#### Developer mode

The developer mode is an advanced mode of BAAT. 
It will display the results of the axe-core test in a more detailed way. 
This is useful for developers who want to see the exact error messages.
It will also print some more debug info into the console.

## Building BAAT yourself
Bookmarklet for running axe-core tests directly in the Browser

1. Install dependencies with `npm install`
2. Build BAAT with `npm run build`

The primary color of the application is controlled by the following environment variables:

- `THEME_PRIMARY` (default: `#d32228`)
- `THEME_PRIMARY_LIGHT` (default: `#7e1317`)
- `THEME_PRIMARY_DARK` (default: `#ed4047`)