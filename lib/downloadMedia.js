const lcl = require('cli-color');
const fetch = require('node-fetch');
const path = require('path');
const {
    writeFileSync
} = require('fs');
const {
    v4: uuidv4
} = require('uuid');

async function downloadMedia(URL, ext) {
    try {
        // try and download media
        console.log(lcl.blue("[Fetch - Info]"), "Fetching media from URL: " + URL);
        var response = await fetch(URL);
        var buffer = await response.buffer();

        // save media into downloads folder with a uuid
        var fileName = uuidv4();
        var filePath = `${path.join(__dirname, "downloads", fileName)}.${ext}`;
        await writeFileSync(filePath, buffer);

        // return file path
        console.log(lcl.green("[Fetch - Success]"), "Successfully downloaded media to: " + filePath);
        return {
            success: true,
            filePath: filePath,
            gifPath: `${path.join(__dirname, "downloads", fileName)}.gif`,
            uuid: fileName
        }
    } catch (err) {
        // catch errors
        console.log(lcl.red("[Fetch - Error]"), "Failed to download media.");
        console.log(lcl.red("[Fetch - Error]"), err.message);
        console.log(lcl.red("[Fetch - Error]"), err.stack);
        return {
            success: false
        }
    }
}

module.exports = downloadMedia;