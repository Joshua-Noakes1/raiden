const lcl = require('cli-color'),
    path = require('path'),
    {
        create: createYoutubeDl
    } = require('youtube-dl-exec');
const ytdlp = createYoutubeDl(path.join(__dirname, process.platform == 'win32' ? 'ytdlp-exec.exe' : 'ytdlp-exec'));

async function execDownload(videoURL) {
    try {
        // get video info
        var videoResult = await ytdlp(videoURL, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            referer: 'https://www.tiktok.com'
        });
        return {
            success: true,
            videoResult
        };
    } catch (error) {
        console.log(lcl.red("[YTDLP Download - Error]"), "Failed to download video with YTDLP", error);
        return {
            success: false,
            message: "Failed to download video with YTDLP"
        };
    }
}

module.exports = execDownload;