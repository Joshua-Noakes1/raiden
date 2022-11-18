const lcl = require('cli-color');
var youtubedl = require('youtube-dl-exec');

async function fetchTikTok(URL) {
    // check ytdl for updates
    console.log(lcl.blue("[YTDL - Info]"), "Checking for updates...");
    youtubedl = require('youtube-dl-exec');
    console.log(lcl.green("[YTDL - Success]"), "Successfully checked for updates.");

    try {
        // try and download media
        console.log(lcl.blue("[YTDL - Info]"), "Fetching TikTok from URL: " + URL);
        var tiktokVideo = await youtubedl(URL, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            verbose: true,
        })
        if (tiktokVideo["_type"] !== "video") {
            console.log(lcl.red("[YTDL - Error]"), "Accounts are not currently supported due to a bug in YTDLP.")
            return {
                success: false
            }
        }

        console.log(lcl.green("[YTDL - Success]"), "Successfully fetched TikTok video.")
        return {
            success: true,
            video: tiktokVideo
        }
    } catch(err) {
        console.log(lcl.red("[YTDL - Error]"), "Failed to fetch TikTok video.")
        console.log(lcl.red("[YTDL - Error]"), err.message)
        console.log(lcl.red("[YTDL - Error]"), err.stack)
        return {
            success: false
        }
    }
}

module.exports = fetchTikTok;