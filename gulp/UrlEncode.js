"use strict";
const Transform = require("stream").Transform;

function encodeRFC3986URIComponent(str) {
    return encodeURIComponent(str).replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
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

            chunk.contents = Buffer.from(encodeRFC3986URIComponent(content));

            callback(null, chunk);
        },
    });
}

module.exports = URLEncoder;