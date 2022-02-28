const lcl = require('cli-color'),
    getURL = require('./components/interaction/interactionURL.js'),
    stageHandler = require('./components/stage/stageHandler.js'),
    {
        MessageEmbed
    } = require('discord.js');

async function videoHandler(interaction) {
    // delay discord interaction
    await interaction.deferReply({
        ephemeral: true
    });

    // get video url [Stage 1 - x]
    await stageHandler(1, interaction);

    let videoURL = await getURL(interaction);
    if (videoURL.success != true) return;

    await interaction.followUp({
        content: videoURL.url
    });

    // final stage (after successful video) [Stage x - x]
    await stageHandler(99, interaction);

    return;
}

module.exports = videoHandler;