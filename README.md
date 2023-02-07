# BAAT

## Building
Bookmarklet for running axe-core tests directly in the Browser

1. Install dependencies with `npm install`
2. Build the bookmarklet with `npm run build`
3. Copy the minified content of `./build/bookmarklet.txt` as bookmark to the browser bookmark toolbar.

## Usage

1. Use the bookmarklet to activate the interface
2. Select a file or enter a URL to load the axe-core script
3. Perform a search using the "Run Tests" button.
4. All serious and critical problems found by axe-core are shown. You can also show minor and moderate problems by activating the filter options in the settings.
