// handle YT-DLP request

const youtubedl = require('youtube-dl-exec');

async function handleYTDLPRequest(url) {
    var videoInfo = await youtubedl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        update: true
    });
    console.log(videoInfo)
    return videoInfo;
}

// test cases
// handleYTDLPRequest("https://www.youtube.com/watch?v=jnaZn7YDMoc"); // mf woof - Works
// handleYTDLPRequest("https://www.reddit.com/r/aww/comments/9x0q0p/this_is_my_dog_who_is_very_sick_and_isnt_able_to/"); // We’ve identified a fix which may take some time to implement, in the meantime ready your bananas 🍌 (or eat them!). [https://www.redditstatus.com/incidents/1xslswydctkp]
// handleYTDLPRequest("https://twitter.com/Gross_Gorex/status/1632153460526161923?s=20") // elon musk stupid bird app - Works
// handleYTDLPRequest("https://vm.tiktok.com/ZMYuyrJkM/"); // french man nom nom crayon - Works
// handleYTDLPRequest("https://www.instagram.com/p/CprJgcKMPk5/?utm_source=ig_web_button_share_sheet"); // bosch the rock  - Works with known video number
// handleYTDLPRequest("https://www.instagram.com/reel/Cpv38bIPcp0/?utm_source=ig_web_copy_link"); // also bosch the rock but insane like makima - works 