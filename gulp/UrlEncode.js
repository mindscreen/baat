"use strict";
const Transform = require("stream").Transform;

function encodeURIComponentForBookmarklet(str) {
    // encode only required special characters for bookmarklets
    return str
        .replaceAll('%',"%25")
        .replaceAll('!',"%21")
        .replaceAll('#',"%23")
        .replaceAll('$',"%24")
        .replaceAll('&',"%26")
        .replaceAll('\'',"%27")
        .replaceAll('*',"%2A")
        .replaceAll('+',"%2B")
        .replaceAll(',',"%2C")
        .replaceAll('/',"%2F")
        .replaceAll('?',"%3F")
        .replaceAll('@',"%40")
        .replaceAll('[',"%5B")
        .replaceAll('\\',"%5C")
        .replaceAll(']',"%5D")
        .replaceAll('`',"%60")
        .replaceAll('|',"%7C")
        .replaceAll('"',"&quot;")
    ;
}

const URLEncoder = () => {
    return new Transform({
        readableObjectMode: true,
        writableObjectMode: true,

        transform: function (chunk, encoding, callback) {
            if (chunk.isNull()) {
                return callback(null, chunk);
            }
            const content = String(chunk.contents)

            chunk.contents = Buffer.from(encodeURIComponentForBookmarklet(content));

            callback(null, chunk);
        },
    });
}

module.exports = URLEncoder;