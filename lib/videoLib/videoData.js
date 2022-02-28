const lcl = require('cli-color');

async function videoData(tiktokVideoExec) {
    var videos = [];

    // extract video data and format into a unified object
    if (tiktokVideoExec.videoResult.extractor_key == "TikTokUser") {
        console.log(lcl.blue("[TikTok - Info]"), "TikTok User detected");
        tiktokVideoExec.videoResult.entries.forEach((data, index, array) => {
            videos.push(tiktokVideoExec.videoResult.entries[index]);
        });
    } else if (tiktokVideoExec.videoResult.extractor_key == "TikTok") {
        console.log(lcl.blue("[TikTok - Info]"), "TikTok Video detected");
        videos.push(tiktokVideoExec.videoResult);
    } else {
        console.log(lcl.red("[TikTok - Error]"), "Failed to sort video data");
        return {
            success: false
        }
    }

    return {
        success: true,
        type: tiktokVideoExec.videoResult.extractor_key == 'TikTokUser' ? 'account' : 'video',
        videos
    }
}

module.exports = videoData;