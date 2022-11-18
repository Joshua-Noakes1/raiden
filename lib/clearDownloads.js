const lcl = require('cli-color');
const path = require('path');
const {
    readdirSync,
    unlinkSync
} = require('fs');

function clearDownloads() {
    // get a list of all files in the downloads folder, keep the .gitkeep file and delete the rest
    console.log(lcl.blue("[Clear - Info]"), "Clearing downloads folder...");
    var files = readdirSync(path.join(__dirname, "downloads"));

    for (const file in files) {
        if (files[file] !== ".gitkeep") {
            try {
                unlinkSync(path.join(__dirname, "downloads", files[file]));
            } catch (err) {
                console.log(lcl.red("[Clear - Error]"), "Failed to delete file: " + files[file]);
                console.log(lcl.red("[Clear - Error]"), err.message);
                console.log(lcl.red("[Clear - Error]"), err.stack);
            }
        }
    }

    console.log(lcl.green("[Clear - Success]"), "Successfully cleared downloads folder.");
}

module.exports = clearDownloads;