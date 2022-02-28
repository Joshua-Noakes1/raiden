const lcl = require('cli-color'),
    {
        MessageEmbed
    } = require('discord.js');

async function stageHandler(stage, interaction) {
    let videoStageHandler = new MessageEmbed()
        .setColor(`#C95B0C`)
        .setTimestamp();

    // title, desc stage
    switch (stage) {
        case 1: // download video meta
            console.log(lcl.blue("[TikTok - Info]"), "Downloading video meta...");
            videoStageHandler.setTitle(`[TikTok - Video] Stage 1 / x - Downloading Video Meta`);
            videoStageHandler.setDescription(`Ayanami is currently downloading the video metadata from TikTok`);
            break;
        case 99: // finished
            console.log(lcl.green("[TikTok - Success]"), "Finished");
            videoStageHandler.setColor("#A7E99C");
            videoStageHandler.setTitle(`[TikTok - Video] Stage x / x - Finished`);
            videoStageHandler.setDescription(`Ayanami has finished downloading the video from TikTok`);
            break;
        default:
            console.log(lcl.red("[TikTok - Error]"), "Invalid stage");
            videoStageHandler.setTitle(`[TikTok - Video] Stage x / x - Woah you broke it!`);
            videoStageHandler.setDescription(`Ayanami has encountered an error while trying to find which stage of the video download process you were on.Please report this on [GitHub](https://github.com/joshua-noakes1/ayanami)`);
    }

    //send embed
    await interaction.editReply({
        embeds: [videoStageHandler]
    });
}

module.exports = stageHandler;