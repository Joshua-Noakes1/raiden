const lcl = require('cli-color'),
    path = require('path'),
    {
        create: createYoutubeDl
    } = require('youtube-dl-exec'),
    yt_dlp = createYoutubeDl(path.join(__dirname, '../', '../', 'bin', process.platform == 'win32' ? 'yt-dlp.exe' : 'yt-dlp'));

async function ytdlCore(URL) {
    try {
        let videoResult = await yt_dlp(URL, {
            dumpSingleJson: true,
            "noCheckCertificate": true
        });
        return {
            success: true,
            videoResult
        }
    } catch (error) {
        console.log(lcl.red("[YT-DLP - Error]"), "Error while downloading video");
        if (process.env.dev == "true") console.log(error);
        return {
            success: false
        };
    }
}

module.exports = ytdlCore;