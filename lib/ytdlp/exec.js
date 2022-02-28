const lcl = require('cli-color'),
    path = require('path'),
    {
        create: createYoutubeDl
    } = require('youtube-dl-exec'),
    ytdlp = createYoutubeDl(path.join(__dirname, process.platform == 'win32' ? 'ytdlp-exec.exe' : 'ytdlp-exec'));

async function execDownload(videoURL) {
    try {
        // get video info
        var videoResult = await ytdlp(videoURL, {
            dumpSingleJson: true,
            verbose: true,
            "no-check-certificate": true
        });
        return {
            success: true,
            videoResult
        };
    } catch (error) {
        console.log(lcl.red("[YTDLP Download - Error]"), "Failed to download video with YTDLP");
        console.log(error);
        return {
            success: false
        };
    }
}

module.exports = execDownload;