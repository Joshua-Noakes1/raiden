const lcl = require('cli-color'),
    lang = require('../../lib/lang/loadLang')(),
    urlParse = require('url-parse'),
    updateYTDLP = require('../../lib/ytdlp/core'),
    videoHandle = require('../../lib/tiktok/videoHandle'),
    {
        MessageEmbed,
        Constants
    } = require('discord.js');

module.exports = {
    category: lang.FILE_COMMANDS_TIKTOK_VIDEO.category || "lang.FILE_COMMANDS_TIKTOK_VIDEO.category",
    description: lang.FILE_COMMANDS_TIKTOK_VIDEO.description || "lang.FILE_COMMANDS_TIKTOK_VIDEO.description",

    slash: true,
    testOnly: process.env.dev == "true" ? true : false, // Only register a slash command for the testing guilds

    options: [{
        name: 'url',
        description: 'Video or account URL from TikTok eg: vm.tiktok.com/ZM8K5XLfV', // example 
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
        const DiscordUserURL = await interaction.options.getString('url');
        const parsedVideoURL = new urlParse(DiscordUserURL);

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

        // apply URL fix
        var videoURL = `${parsedVideoURL.protocol}//${parsedVideoURL.hostname}${parsedVideoURL.pathname}`;
        videoURL = videoURL.replace(/(\r\n|\n|\r)/gm, "").trim();

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
                name: "Stuck with just this embed?",
                value: "Ayanami is downloading the video in the background, please wait...",
                inline: true
            }])
            .setColor("#00ff00")
            .setTimestamp();

        // return info embed
        await interaction.editReply({
            embeds: [videoInfoEmbed]
        });


        // start video handle
        await videoHandle(interaction, videoURL, 'video');
        return;
    },
}