const lcl = require('cli-color'),
    path = require('path'),
    downloadCore = require('../../bin/ytdlp/download/ytdlpCore'),
    videoExec = require('../../bin/ytdlp/bin/ytdlpExec'),
    {
        MessageEmbed
    } = require('discord.js'),
    discordjs = require('discord.js');

// from https://docs.wornoffkeys.com/commands/ping-pong-command-example

module.exports = {
    category: 'Media',
    description: 'Replies with an individual video from TikTok', // Required for slash commands

    slash: true, // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds

    options: [{
        name: 'url',
        description: 'The URL of the TikTok video to download',
        required: true,
        type: discordjs.Constants.ApplicationCommandOptionTypes.STRING
    }],

    callback: async ({
        interaction
    }) => {
        // delay discord reply so we have time to make image
        await interaction.deferReply();

        // check for ytdlp updates
        console.log(lcl.blue("[Discord - Info]"), "Checking for YTDLP updates...");
        var ytdlpUpdate = await downloadCore();
        if (ytdlpUpdate.success == false) {
            // build YTDLP error embed
            const ytdlpErrorEmbed = new MessageEmbed()
                .setTitle("YTDLP Error")
                .setDescription("Failed to Update YTDLP, Please try again later...")
                .setColor("#ff0000")
                .setTimestamp();

            // return error embed
            return await interaction.editReply({
                embeds: [ytdlpErrorEmbed]
            });
        }

        // get video info
        console.log(lcl.blue("[Discord - Info]"), "Getting video info...");
        console.log(await interaction.options.getString('url'));
        var tiktokVideoExec = await videoExec(await interaction.options.getString('url'));

        if (tiktokVideoExec.success == false) {
            // build video error embed
            const videoErrorEmbed = new MessageEmbed()
                .setTitle("Video Error")
                .setDescription("Failed to get video URLs, Please try again later...")
                .setColor("#ff0000")
                .setTimestamp();

            // return error embed
            return await interaction.editReply({
                embeds: [videoErrorEmbed]
            });
        }

        console.log(tiktokVideoExec.videoResult);
        // build video embed
        // test
        return await interaction.editReply(`${tiktokVideoExec.videoResult}`);
    },
}