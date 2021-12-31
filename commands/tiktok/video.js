const lcl = require('cli-color'),
    urlParse = require('url-parse'),
    updateYTDLP = require('../../bin/ytdlp/download/ytdlpCore'),
    videoYTDLP = require('../../bin/ytdlp/bin/ytdlpExec'),
    {
        MessageEmbed,
        Constants
    } = require('discord.js');

module.exports = {
    category: 'Media',
    description: 'Replies with an individual video from TikTok',

    slash: true,
    testOnly: true, // Only register a slash command for the testing guilds

    options: [{
        name: 'url',
        description: 'Single video from TikTok eg: vm.tiktok.com/x/x', // example 
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
    }],

    callback: async ({
        interaction
    }) => {
        // delay discord reply interaction
        await interaction.deferReply({
            ephemeral: true
        });

        // Parse URL
        const videoURL = await interaction.options.getString('url');
        const parsedVideoURL = new urlParse(videoURL);

        // Check if URL is valid
        if (!parsedVideoURL.hostname.includes("tiktok")) { // vm.tiktok.com - Mobile Share URL, www.tiktok.com - Desktop Share URL
            console.log(lcl.red("[TikTok Video - Error]"), "Invalid URL");
            const videoURLErrorEmbed = new MessageEmbed()
                .setTitle("Video URL Error")
                .setDescription("Invalid URL, Please try again...")
                .setColor("#ff0000")
                .setTimestamp();
            // return error embed
            await interaction.editReply({
                embeds: [videoURLErrorEmbed]
            });
            return;
        }

        // check for ytdlp updates
        const ytdlpUpdate = await updateYTDLP();
        if (ytdlpUpdate.success == false) {
            // build YTDLP error embed
            const ytdlpErrorEmbed = new MessageEmbed()
                .setTitle("YTDLP Error")
                .setDescription("Failed to Update YTDLP, Please try again later...")
                .setColor("#ff0000")
                .setTimestamp();
            // return error embed
            await interaction.editReply({
                embeds: [ytdlpErrorEmbed]
            });
            return;
        }

        // fetch video info
        const tiktokVideo = await videoYTDLP(videoURL);
        console.log(tiktokVideo);

        // log new video
        console.log(lcl.blue("[TikTok Video - Info]"), "New video");
        return;
    },
}