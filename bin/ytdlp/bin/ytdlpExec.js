const lcl = require('cli-color'),
    path = require('path'),
    {
        create: createYoutubeDl
    } = require('youtube-dl-exec'),
    ytdlp = createYoutubeDl(path.join(__dirname, process.platform == 'win32' ? 'ytdlp-exec.exe' : 'ytdlp-exec'));

async function execDownload(videoURL) {
    try {
        // set options for ytdlp
        let ytdlpOptions = {
            dumpSingleJson: true,
            verbose: false,
            "no-check-certificate": true
        }
        if (process.env.DEV == "true") ytdlpOptions.verbose = true;

        // get video info
        var videoResult = await ytdlp(videoURL, ytdlpOptions);
        return {
            success: true,
            videoResult
        };
    } catch (error) {
        console.log(lcl.red("[YTDLP Download - Error]"), "Failed to download video with YTDLP");
        if (process.env.DEV == "true") console.log(error);
        return {
            success: false
        };
    }
}

module.exports = execDownload;