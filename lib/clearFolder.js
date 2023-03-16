const lcl = require('cli-color');
const path = require('path');
const { rmSync, mkdirSync, mkdir } = require('fs');

function clearFolder() {
    console.log(lcl.blue("[Clear Folder - Info]"), "Clearing folder...");
    try {
        rmSync(path.join(__dirname, 'download'), { recursive: true, force: true });
        console.log(lcl.green("[Clear Folder - Success]"), "Folder cleared successfully.");
    } catch (err) {
        console.log(lcl.warn("[Clear Folder - Error]"), err);
    }
    try { // if downloads doesnt exist when we delete it will cause error so this is in its own try catch
        mkdirSync(path.join(__dirname, 'download'), { recursive: true });
        console.log(lcl.green("[Clear Folder - Success]"), "Folder created successfully.");
    } catch (err) {
        console.log(lcl.warn("[Clear Folder - Error]"), err);
    }

}

module.exports = clearFolder;