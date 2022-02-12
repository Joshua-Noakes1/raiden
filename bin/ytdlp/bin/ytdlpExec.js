const lcl = require('cli-color'),
    fetch = require('node-fetch'),
    path = require('path'),
    {
        create: createYoutubeDl
    } = require('youtube-dl-exec'),
    ytdlp = createYoutubeDl(path.join(__dirname, process.platform == 'win32' ? 'ytdlp-exec.exe' : 'ytdlp-exec'));

async function execDownload(url) {
    /* fix for vm.tiktok.com timeout - Could not send HEAD request to https://vm.tiktok.com/ZMLje4Gem/:
        This should be temporary, until i get time to put a proper fix in place
    */
    if (url.includes('vm')) {
        var videoURL = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual'
        });
        videoURL = await videoURL.headers.get('Location');
    } else {
        var videoURL = url;
    }

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
        console.log(lcl.red("[YTDLP Download - Error]"), "Failed to download video with YTDLP", error);
        return {
            success: false
        };
    }
}

module.exports = execDownload;