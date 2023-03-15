const lcl = require("cli-color");
const fetch = require("node-fetch");
const path = require("path");
const {
    writeFileSync,
    statSync
} = require("fs");
const {
    v4: uuidv4
} = require("uuid");

async function downloadMedia(url, ext, headers) {
    try {
        // download media
        console.log(lcl.blue("[Media - Info]"), "Downloading media...");
        var mediaReq = await fetch(url, {
            method: "GET",
            headers: headers !== undefined ? headers : {}
        });
        if (mediaReq.status !== 200) {
            console.log(lcl.red("[Media - Error]"), "Failed to download media.");
            return {
                success: false
            }
        }

        // save media to disk
        var mediaBuffer = await mediaReq.buffer();
        var mediaUUID = uuidv4();
        var mediaPath = path.join(__dirname, "download", `${mediaUUID}.${ext}`);
        await writeFileSync(mediaPath, mediaBuffer);

        var fileSize = await statSync(mediaPath).size;

        return {
            success: true,
            mediaPath,
            mediaUUID,
            fileSize
        }
    } catch (err) {
        console.log(lcl.red("[Media - Error]"), err);
        return {
            success: false
        }
    }
}

module.exports = downloadMedia;