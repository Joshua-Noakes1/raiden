// handle YT-DLP request
const lcl = require('cli-color');
const youtubedl = require('youtube-dl-exec');

async function handleYTDLPRequest(url) {
    try {
        console.log(lcl.blue("[YT-DLP - Info]"), "Downloading video info...");
        var videoInfo = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
            update: true
        });
        console.log(lcl.green("[YT-DLP - Info]"), "Successfully downloaded video info!");
        return {
            success: true,
            videoInfo
        };
    } catch (err) {
        console.log(lcl.red("[YT-DLP - Error]"), "Failed to download video info...", lcl.yellow(err.toString().split("Error: ")[1]));
        return {
            success: false
        }
    }
}

module.exports = handleYTDLPRequest;

// test cases
// handleYTDLPRequest("https://www.youtube.com/watch?v=jnaZn7YDMoc"); // mf woof - Works
// handleYTDLPRequest("https://www.reddit.com/r/okbuddyhololive/comments/11qsghb/shouldve_not_taken_it/"); // We’ve identified a fix which may take some time to implement, in the meantime ready your bananas 🍌 (or eat them!). [https://www.redditstatus.com/incidents/1xslswydctkp] - works
// handleYTDLPRequest("https://twitter.com/Gross_Gorex/status/1632153460526161923?s=20") // elon musk stupid bird app - Works
// handleYTDLPRequest("https://vm.tiktok.com/ZMYuyrJkM/"); // french man nom nom crayon - Works
// handleYTDLPRequest("https://www.instagram.com/p/CprJgcKMPk5/?utm_source=ig_web_button_share_sheet"); // bosch the rock - Works with known video number
// handleYTDLPRequest("https://www.instagram.com/reel/Cpv38bIPcp0/?utm_source=ig_web_copy_link"); // also bosch the rock but insane like makima - works (Just to be clear im not insane it was either this or a vtuber clip)
// handleYTDLPRequest("https://clips.twitch.tv/RudeHyperMuleHotPokket-eEpV0NPXnxd6yI8f") // Fel of but is actually ok now - Works
// handleYTDLPRequest("https://www.tiktok.com/@jokeryoda/video/7161539759175716101"); - Fails correctly