const lcl = require('cli-color'),
    fetch = require('node-fetch');

// make request to github api to get newest version of ytdlp and return the download url for platform
async function getDownloadURL() {
    try {
        // get api
        var githubAPI = await fetch('https://api.github.com/repos/yt-dlp/yt-dlp/releases');
        githubAPI = await githubAPI.json();

        // get newest version for platform
        switch (process.platform) {
            case 'win32': // windows
                var ytdlpDownload = `https://github.com/yt-dlp/yt-dlp/releases/download/${githubAPI[0].tag_name}/yt-dlp.exe`;
                break;
            case 'linux': // linux / unix
            case 'darwin': // mac
                var ytdlpDownload = `https://github.com/yt-dlp/yt-dlp/releases/download/${githubAPI[0].tag_name}/yt-dlp`;
                break;
            default: // catch all
                console.log(lcl.red("[YTDLP Download - Error]"), `Failed to find compatilble download for your system (${process.platform})`);
                return {success: false}
        }

        // return download url
        return {
            success: true,
            versionTag: githubAPI[0].tag_name,
            platform: process.platform == 'win32' ? '.exe' : '',
            downloadURL: ytdlpDownload
        };
    } catch (error) {
        console.log(lcl.red("[YTDLP Download - Error]"), "Failed to download YTDLP from Github", error);
        return {success: false, error}
    }
}

module.exports = getDownloadURL;