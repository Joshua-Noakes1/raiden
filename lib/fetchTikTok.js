require('dotenv').config();
const lcl = require('cli-color');
const path = require('path');
var platform = require('os').platform();
var youtubedl = require('youtube-dl-exec');
var {
    create
} = require('youtube-dl-exec');


async function fetchTikTok(URL) {
    try {
        // check ytdl for updates
        if (process.env.TIKTOK_FIX === "true") {
            console.log(lcl.blue("[YTDL - Info]"), "Using local version of YTDLP. Built 28th February 2023");
            if (platform === '') {
                console.log(lcl.red("[YTDL - Error]"), "Unsupported platform. Please build manually from https://github.com/redraskal/yt-dlp/archive/refs/heads/fix/tiktok-user");
                return {
                    success: false
                }
            }

            var location = "";
            switch (platform) {
                case "darwin":
                case 'linux':
                    location = "/usr/local/bin/yt-dlp";
                    break;
                case 'win32':
                    location = path.join(__dirname, "../", "bin", "yt-dlp.exe"); // Place the binary in the bin folder
                    break;
            }

            // find the path to the installed python binary
            if (location === "") {
                console.log(lcl.red("[YTDL - Error]"), "Unsupported platform. Please build manually from https://github.com/redraskal/yt-dlp/archive/refs/heads/fix/tiktok-user");
                return {
                    success: false
                }
            }
            youtubedl = create(location);
        } else {
            console.log(lcl.blue("[YTDL - Info]"), "Checking for updates...");
            youtubedl = require('youtube-dl-exec');
            console.log(lcl.green("[YTDL - Success]"), "Successfully checked for updates.");
        }
    } catch (err) {
        console.log(lcl.red("[YTDL - Error]"), "Failed to check for updates.");
        console.log(lcl.red("[YTDL - Error]"), err.message)
        console.log(lcl.red("[YTDL - Error]"), err.stack)
        return {
            success: false
        }
    }

    try {
        // try and download media
        console.log(lcl.blue("[YTDL - Info]"), "Fetching TikTok from URL: " + URL);
        var tiktokVideo = await youtubedl(URL, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            verbose: true,
        });

        var videos = [];
        if (tiktokVideo["_type"] == "video") {
            videos.push(tiktokVideo);
        } else if (tiktokVideo["_type"] == "playlist") {
            videos = tiktokVideo["entries"];
        }

        console.log(lcl.green("[YTDL - Success]"), "Successfully fetched TikTok video.");
        var returnJSON = {
            success: true,
            video: videos
        }
        if (tiktokVideo["_type"] == "playlist") {
            var user = {
                "id": tiktokVideo["id"],
                "name": tiktokVideo["nickname"],
                "username": tiktokVideo["title"],
                "avatar": tiktokVideo["thumbnail"],
                "url": tiktokVideo["webpage_url"],
            }
            returnJSON["user"] = user;
        }
        return returnJSON;
    } catch (err) {
        console.log(lcl.red("[YTDL - Error]"), "Failed to fetch TikTok video.")
        console.log(lcl.red("[YTDL - Error]"), err.message)
        console.log(lcl.red("[YTDL - Error]"), err.stack)
        return {
            success: false
        }
    }
}

module.exports = fetchTikTok;