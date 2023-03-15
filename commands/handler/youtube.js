const lcl = require("cli-color");
const ytdlp = require('../../lib/ytdlp');

async function youtubeHandle(url) {
    try {
        var videoInfo = await ytdlp(url);
        if (!videoInfo.success) {
            return {
                success: false
            }
        }

        return {
            success: true,
            videoInfo: videoInfo.videoInfo
        }
    } catch (err) {
        console.log(lcl.red("[YouTube - Error]"), err);
        return {
            success: false
        }
    }
}

module.exports = youtubeHandle;