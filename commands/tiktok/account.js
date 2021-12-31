const lcl = require('cli-color'),
    urlParse = require('url-parse'),
    updateYTDLP = require('../../bin/ytdlp/download/ytdlpCore'),
    videoHandle = require('./lib/videoHandle'),
    {
        MessageEmbed,
        Constants
    } = require('discord.js');

module.exports = {
    category: 'Media',
    description: 'Replies with all videos from a user on TikTok',

    slash: true,
    testOnly: true, // Only register a slash command for the testing guilds

    options: [{
        name: 'url',
        description: 'Single link to a TikTok account eg: vm.tiktok.com/ZM8K5XLfV', // example 
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
    }, {
        name: 'oldest',
        description: 'If true will return the oldest videos first',
        required: false,
        type: Constants.ApplicationCommandOptionTypes.BOOLEAN
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
        if (parsedVideoURL.hostname.match(/^(?:https?:\/\/)?(?:vm\.)?(?:www\.)?tiktok\.com/gm) == null) { // vm.tiktok.com - Mobile Share URL, www.tiktok.com - Desktop Share URL
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

        // return info embed
        const videoInfoEmbed = new MessageEmbed()
            .setTitle("Video Info")
            .addFields([{
                name: "Strange Video URL",
                value: "The video URL might look odd but it is correct and will send you to the video.",
                inline: true
            }, {
                name: "Dynamic Cover GIF",
                value: "Discord has an issue with displaying the dynamic cover GIF, so it is not displayed.",
                inline: true
            }, {
                name: "Stuck with just this embed?",
                value: "Accore is downloading the video in the background, please wait...",
                inline: true
            }])
            .setColor("#00ff00")
            .setTimestamp();

        // return info embed
        await interaction.editReply({
            embeds: [videoInfoEmbed]
        });


        // start video handle
        await videoHandle(interaction, videoURL, 'account', interaction.options.getBoolean('oldest'));
        return;
    },
}