const lcl = require('cli-color'),
    path = require('path'),
    {
        v4: uuidv4
    } = require('uuid'),
    {
        writeFileSync
    } = require('fs'),
    fetch = require('node-fetch');

async function downloadMedia(url, mediaExt) {
    // download video url
    console.log(lcl.blue("[Fetch - Info]"), "Downloading media...");
    try {
        var videoResult = await fetch(url);
        videoResult = await videoResult.buffer();

        // create uuid for video and get file type
        var videoUUID = uuidv4();

        // save video and return info
        console.log(lcl.blue("[Fetch - Info]"), `Saving media(${mediaExt})...`);
        await writeFileSync(path.join(__dirname, '../', '../', 'ytdlp', 'videos', `${videoUUID}.${mediaExt}`), videoResult);
        console.log(lcl.green("[Fetch - Success]"), `Media saved(${videoUUID}.${mediaExt})`);
        
        // return to client 
        return {
            success: true,
            UUID: videoUUID,
            path: path.join(__dirname, '../', '../', 'ytdlp', 'videos', `${videoUUID}.${mediaExt}`),
            pathFolder: path.join(__dirname, '../', '../', 'ytdlp', 'videos'),
            format: mediaExt
        }

    } catch (error) {
        console.log(lcl.red("[Fetch - Error]"), "Failed to download media");
        console.log(error);
        return {
            success: false,
            message: "Failed to download media"
        }
    }
}

module.exports = downloadMedia;