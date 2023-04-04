# BAAT ![BAAT Logo](./assets/Logo-small.svg)

With BAAT you can perform automated accessibility testing as a bookmarklet or user script in your browser.
It allows accessibility tests to be performed even in situations where the installation of additional software or plug-ins is not possible.

You can simply use axe-core or create your custom rulesets based on axe-core.
## Features
- Provides automated accessibility checks for websites.
- Uses axe-core for quick and precise analysis.
- Can be run as a bookmarklet or userscript.
- Suitable for any organization dedicated to accessible website development.

## Usage

There are two ways to install and use BAAT:

### Usage as a bookmarklet
1. Head to the [BAAT GitHub releases page](https://github.com/mindscreen/baat/releases/latest).
2. Download the bookmarklet.txt file.
3. Create a new bookmark in your browser and paste the content of the bookmarklet.txt file into the URL field. _Note: the process of creating a bookmarklet can vary depending on your browser, so please refer to your browser's documentation for further information.
4. Get a version of axe.min.js.

   The axe.min.js file contains the rule definitions. It needs to be selected in the BAAT interface to enable the bookmarklet to run the tests.

   You can [download a version of axe.min.js](https://mscr.it/baat/axe.min.js) (v4.6.3).
5. Activate the bookmarklet on any page.
6. Select the axe.min.js file to load the axe-core into BAAT and press the run button to run BAAT

### Usage as an userscript
1. Install a userscript manager, such as Tampermonkey. You will find installation instructions on the [Tampermonkey website](https://www.tampermonkey.net/).
2. Head to the [BAAT GitHub releases page](https://github.com/mindscreen/baat/releases/latest).
3. Download the userscript.js file.
4. Install the Userscript using your userscript manager.
5. Get a version of axe.min.js.

   The axe.min.js file contains the rule definitions. It needs to be selected in the BAAT interface to enable the bookmarklet to run the tests.

   You can [download a version of axe.min.js](https://mscr.it/baat/axe.min.js) (v4.6.3).
6. Activate the bookmarklet on any page.
7. Select the axe.min.js file to load the axe-core into BAAT and press the run button to run BAAT


### Options

#### Issue Impact Filters

The Issue Impact filters control which issues are shown in the results. The default is to show only serious or critical issues.

#### Developer mode

The developer mode is an advanced mode of BAAT. 
It will display the results of the axe-core test in a more detailed way. 
This is useful for developers who want to see the exact error messages.
It will also print some more debug info into the console.

## Links

- 🌎 [BAAT Project website](https://mscr.it/baat/)
- 🌎 [Axe Core GitHub Page](https://github.com/dequelabs/axe-core)

## Troubleshooting
### Content Security Policies (CSP)
Some websites use Content Security Policies (CSP) to restrict the execution of third-party scripts. If a website has a CSP that blocks the execution of third-party scripts, BAAT may not work as expected.

If you encounter issues with BAAT not running on a website, it's possible that the website has a CSP that blocks the execution of third-party scripts. In this case, you may need to contact the website administrator to request that they whitelist BAAT in their CSP.

## Building BAAT yourself
Bookmarklet for running axe-core tests directly in the Browser

1. Install dependencies with `npm install`
2. Build BAAT with `npm run build`

The primary color of the application is controlled by the following environment variables:

- `THEME_PRIMARY` (default: `#d32228`)
- `THEME_PRIMARY_LIGHT` (default: `#7e1317`)
- `THEME_PRIMARY_DARK` (default: `#ed4047`)

## Creating a new Rule
BAAT allows you to run custom versions of axe-core. This way you can add your own rules to the test.
To do so, you need to create a fork of the [axe-core repository]](https://github.com/dequelabs/axe-core) and [add your own rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-development.md).
After running `npm run build` in the root repository of the root folder of axe-core, you will find a file called `axe.min.js` in the root folder. T
his file contains your custom rules and can be used with BAAT.

## Notes
If you have any questions or feedback, please [open an issue](https://github.com/mindscreen/baat/issues/new).

In order to stay up to date to new releases you can watch the releases of this project.