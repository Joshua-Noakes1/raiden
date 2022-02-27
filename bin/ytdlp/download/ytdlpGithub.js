require('dotenv').config();
const lcl = require('cli-color'),
    fetch = require('node-fetch');

// make request to github api to get newest version of ytdlp and return the download url for platform
async function getDownloadURL() {
    if (process.env.REPO == undefined || process.env.REPO == '') process.env.REPO = 'yt-dlp/yt-dlp'; // default repo

    try {
        // get api
        var githubAPI = await fetch(`https://api.github.com/repos/${process.env.REPO}/releases`);
        githubAPI = await githubAPI.json();

        // check if repo exists
        if (githubAPI.message) {
            console.log(lcl.red("[Github API - Error]"), "Failed to find Github repo");
            return {
                success: false
            }
        }

        // get release index
        var releaseIndex = {
            unix: -1,
            win: -1
        }
        await asyncForEach(githubAPI[0].assets, async (asset, index) => {
            if (asset.content_type == "application/octet-stream" && asset.name == "yt-dlp") releaseIndex.unix = index;
            if (asset.content_type == "application/vnd.microsoft.portable-executable" && (asset.name == "yt-dlp.exe" || asset.name == "yt-dlp_x86.exe")) releaseIndex.win = index;
        });

        // get newest version for platform
        switch (process.platform) {
            case 'win32': // windows
                if (releaseIndex.win == -1) {
                    console.log(lcl.red("[Github API - Error]"), "Failed to find latest version for Windows. Follow the instructions on the GitHub help page to download YTDLP for Windows");
                    return {
                        success: false
                    }
                }
                var ytdlpDownload = githubAPI[0].assets[releaseIndex.win].browser_download_url;
                break;
            case 'linux': // linux / unix
            case 'darwin': // mac
                if (releaseIndex.unix == -1) {
                    console.log(lcl.red("[Github API - Error]"), "Failed to find latest version for Linux / MacOS. Follow the instructions on the GitHub help page to download YTDLP for Linux / MacOS");
                    return {
                        success: false
                    }
                }
                var ytdlpDownload = githubAPI[0].assets[releaseIndex.unix].browser_download_url;
                break;
            default: // catch all
                console.log(lcl.red("[Github API - Error]"), `Failed to find compatilble download for your system (${process.platform} - https://github.com/${process.env.REPO}/releases)`);
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
        console.log(lcl.red("[Github API - Error]"), "Failed to download YTDLP from Github");
        if (process.env.dev == "true") console.log(error);
        return {
            success: false
        }
    }
}

// fix callback hell 
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = getDownloadURL;