// ==UserScript==
// @name         BAAT
// @namespace    http://tampermonkey.net/
// @version      <%= version %>
// @description  Run axe-core from the browser
// @author       Mindscreen GmbH
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @homepage     <%= homepage %>
// ==/UserScript==

(function() {
    'use strict';

    function run() {
// baat
    }

    GM_registerMenuCommand('Run BAAT', run);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('baat-show-id')) {
        run();
    }
})();