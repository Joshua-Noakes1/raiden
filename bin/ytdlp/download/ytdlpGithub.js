require('dotenv').config();
const lcl = require('cli-color'),
    fetch = require('node-fetch');

// make request to github api to get newest version of ytdlp and return the download url for platform
async function getDownloadURL() {
    if (process.env.REPO == undefined || process.env.REPO == '') process.env.REPO = 'ytdlp/ytdlp'; // default repo

    try {
        // get api
        var githubAPI = await fetch(`https://api.github.com/repos/${process.env.REPO}/releases`);
        githubAPI = await githubAPI.json();

        // check if repo exists
        if (githubAPI.message) {
            console.log(lcl.red("[YTDLP Download - Error]"), "Failed to find Github repo");
            return {
                success: false
            }
        }

        // get newest version for platform
        switch (process.platform) {
            case 'win32': // windows
                var ytdlpDownload = githubAPI[0].assets[3].browser_download_url;
                break;
            case 'linux': // linux / unix
            case 'darwin': // mac
                var ytdlpDownload = githubAPI[0].assets[2].browser_download_url;
                break;
            default: // catch all
                console.log(lcl.red("[YTDLP Download - Error]"), `Failed to find compatilble download for your system (${process.platform} - https://github.com/${process.env.REPO}/releases)`);
                return {
                    success: false
                }
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
        return {
            success: false
        }
    }
}

module.exports = getDownloadURL;