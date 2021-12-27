// This video is a lifesaver - https://www.youtube.com/watch?v=EXx-t9CRKeo
const lcl = require('cli-color'),
    {
        writeFileSync,
        readFileSync,
        existsSync
    } = require('fs');

/**
 * Saves JSON to disk
 * 
 * @param {string} filename
 * @param {object} data
 * @param {boolean} suppress
 */
function writeJSON(filename, data, suppress) {
    try {
        if (!suppress) console.log(lcl.green('[File - Success]'), `Saved JSON data ${filename}`);
        return writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
        if (!suppress) console.log(lcl.red('[File - Error]'), `Failed to save JSON data "${filename}"`);
        return console.log(err);
    }
}

/**
 * Reads JSON from disk and returns its value
 * 
 * @param {string} String filename
 * @returns {object} JSON data
 */
function readJSON(filename, suppress) {
    if (existsSync(filename)) {
        try {
            var json = JSON.parse(readFileSync(filename).toString());
            if (!suppress) console.log(lcl.green('[File - Success]'), `Read JSON data "${filename}"`);
            return json;
        } catch (err) {
            if (!suppress) console.log(lcl.red('[File - Error]'), `Failed to read JSON data "${filename}"`);
            return console.log(err);
        }
    } else {
        if (!suppress) console.log(lcl.red('[File - Error]'), `File Not Found "${filename}"`);
        return {
            "success": false,
            "message": "Failed to read file",
        }
    }
}

module.exports = {
    writeJSON,
    readJSON
}