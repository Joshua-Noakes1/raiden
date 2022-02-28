const lcl = require('cli-color'),
    {
        MessageEmbed
    } = require('discord.js');

async function downloadSteps(step, array, index) {
    // setup video object
    var videoDownloadStepsEmbed = new MessageEmbed()
        .setColor(`#C95B0C`)
        .setTimestamp();

    // edit title and description
    switch (step) {
        case 1: // Video Data
            console.log(lcl.blue(`[TikTok - Info]`), `Step 1 / 7 - Downloading Video Data`);
            videoDownloadStepsEmbed.setTitle(`[TikTok Video] Video Data - 1 / 7${array.length > 1 ? ` | Video ${index + 1} of ${array.length}` : ''}`);
            videoDownloadStepsEmbed.setDescription(`Ayanami is currently extracting the video data...`);
            break;
        case 2: // Thumbnail
            console.log(lcl.blue(`[TikTok - Info]`), `Step 2 / 7 - Downloading Thumbnails`);
            videoDownloadStepsEmbed.setTitle(`[TikTok Video] Thumbnails - 2 / 7${array.length > 1 ? ` | Video ${index + 1} of ${array.length}` : ''}`);
            videoDownloadStepsEmbed.setDescription(`Ayanami is currently downloading the video thumbnails...`);
            break;
        case 3: // WebP to GIF
            console.log(lcl.blue(`[TikTok - Info]`), `Step 3 / 7 - Converting WebP to GIF`);
            videoDownloadStepsEmbed.setTitle(`[TikTok Video] WebP to GIF - 3 / 7${array.length > 1 ? ` | Video ${index + 1} of ${array.length}` : ''}`);
            videoDownloadStepsEmbed.setDescription(`Ayanami is currently trying to convert the animated thumbnail to a compatible Discord format...`);
            break;
        case 4: // Video Download
            console.log(lcl.blue(`[TikTok - Info]`), `Step 4 / 7 - Downloading Videos`);
            videoDownloadStepsEmbed.setTitle(`[TikTok Video] Video Download - 4 / 7${array.length > 1 ? ` | Video ${index + 1} of ${array.length}` : ''}`);
            videoDownloadStepsEmbed.setDescription(`Ayanami is currently downloading the videos...`);
            break;
        case 5: // QC
            console.log(lcl.blue(`[TikTok - Info]`), `Step 5 / 7 - Quality Check`);
            videoDownloadStepsEmbed.setTitle(`[TikTok Video] Quality Check - 5 / 7${array.length > 1 ? ` | Video ${index + 1} of ${array.length}` : ''}`);
            videoDownloadStepsEmbed.setDescription(`Ayanami is currently checking the videos to make sure they can be uploaded to Discord correctly...`);
            break;
        case 6: // Video Upload
            console.log(lcl.blue(`[TikTok - Info]`), `Step 6 / 6 - Video Upload`);
            videoDownloadStepsEmbed.setTitle(`[TikTok Video] Uploading Videos - 6 / 6${array.length > 1 ? ` | Video ${index + 1} of ${array.length}` : ''}`);
            videoDownloadStepsEmbed.setDescription(`Ayanami is currently uploading the videos to Discord...\nThis could take upto 30 seconds depending on the video size and upload speed.`);
            break;
    }

    // return embed
    return videoDownloadStepsEmbed;
}

module.exports = downloadSteps;