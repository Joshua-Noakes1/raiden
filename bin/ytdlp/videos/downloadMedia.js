const lcl = require('cli-color'),
    path = require('path'),
    {
        v4: uuidv4
    } = require('uuid'),
    {
        writeFileSync
    } = require('fs'),
    fetch = require('node-fetch');

async function downloadMedia(url, ext) {
    // download video url
    console.log(lcl.blue("[Fetch - Info]"), "Downloading media...");
    try {
        var videoResult = await fetch(url);
        videoResult = await videoResult.buffer();

        // create uuid for video and get file type
        var videoUUID = uuidv4();

        // save video and return info
        console.log(lcl.blue("[Fetch - Info]"), "Saving media...");
        await writeFileSync(path.join(__dirname, 'static', `${videoUUID}.${ext}`), videoResult);

        // return to client 
        return {
            success: true,
            videoUUID,
            path: path.join(__dirname, 'static', `${videoUUID}.${ext}`),
            ext
        }

    } catch (error) {
        console.log(lcl.red("[Fetch - Error]"), "Failed to download media", error);
        return {
            success: false,
            message: "Failed to download media"
        }
    }
}

module.exports = downloadMedia;