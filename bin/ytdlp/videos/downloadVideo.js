const lcl = require('cli-color'),
    path = require('path'),
    {
        v4: uuidv4
    } = require('uuid'),
    {
        writeFileSync
    } = require('fs'),
    fetch = require('node-fetch');

async function downloadVideo(url) {
    // download video url
    console.log(lcl.blue("[Fetch - Info]"), "Downloading video...");
    try {
        var videoResult = await fetch(url);
        videoResult = await videoResult.buffer();

        // create uuid for video and get file type
        var videoUUID = uuidv4();

        // save video and return info
        console.log(lcl.blue("[Fetch - Info]"), "Saving video...");
        await writeFileSync(path.join(__dirname, 'static', `${videoUUID}.mp4`), videoResult);

        // return to client 
        return {
            success: true,
            videoUUID,
            path: path.join(__dirname, 'static', `${videoUUID}.mp4`)
        }

    } catch (error) {
        console.log(lcl.red("[Fetch - Error]"), "Failed to download video", error);
        return {
            success: false,
            message: "Failed to download video"
        }
    }
}

module.exports = downloadVideo;