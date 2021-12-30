const lcl = require('cli-color'),
    path = require('path'),
    downloadCore = require('../../bin/ytdlp/download/ytdlpCore'),
    videoExec = require('../../bin/ytdlp/bin/ytdlpExec'),
    downloadMedia = require('../../bin/ytdlp/videos/downloadMedia'),
    getVideoData = require('./lib/getVideoData'),
    sendVideoEmbed = require('./lib/sendVideoEmbed'),
    {
        unlinkSync
    } = require('fs'),
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
        description: 'Downloads a single video from TikTok',
        required: true,
        type: discordjs.Constants.ApplicationCommandOptionTypes.STRING
    }],

    callback: async ({
        interaction
    }) => {
        // delay discord reply so we have time to make image
        await interaction.deferReply({
            ephemeral: true
        });

        // check for ytdlp updates
        console.log(lcl.blue("[YTDLP - Info]"), "Checking for YTDLP updates...");
        var ytdlpUpdate = await downloadCore();
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

        // get video info
        console.log(lcl.blue("[YTDLP - Info]"), "Getting video info...");
        var tiktokVideoExec = await videoExec(await interaction.options.getString('url'));

        if (tiktokVideoExec.success == false) {
            // build video error embed
            const videoErrorEmbed = new MessageEmbed()
                .setTitle("Video Error")
                .setDescription("Failed to get video URLs, Please try again later...")
                .setColor("#ff0000")
                .setTimestamp();

            // return error embed
            await interaction.editReply({
                embeds: [videoErrorEmbed]
            });
            return;
        }

        // Start real download

        // store video urls etc and data 
        var tiktokVideoData = await getVideoData(tiktokVideoExec);

        // try and download video
        var mediaDownload = {
            video: {
                watermarked: await downloadMedia(tiktokVideoData.video.video.watermarked.url, tiktokVideoData.video.video.watermarked.ext),
                raw: await downloadMedia(tiktokVideoData.video.video.raw.url, tiktokVideoData.video.video.raw.ext)
            },
            image: {
                static: await downloadMedia(tiktokVideoData.video.images.cover, 'png'),
                dynamic: await downloadMedia(tiktokVideoData.video.images.dynamic, 'gif')
            }
        }

        // tell user that the url might look strange
        const videoURLEmbed = new MessageEmbed()
            .setTitle('Video Info')
            .addFields({
                name: "Video URL",
                value: `The video URL might look strange, but it does work!`,
                inline: true
            }, {
                name: "Missing top image",
                value: `Discord has an issue display gifs but using "Open Original" should still will work.`,
                inline: true
            }, {
                name: "\u200b",
                value: "\u200b",
                inline: true
            })
            .setColor('#00ff00')
            .setTimestamp();
        await interaction.editReply({
            embeds: [videoURLEmbed],
            ephemeral: true
        });

        // video embed handle
        await sendVideoEmbed(interaction, tiktokVideoData, mediaDownload);

        //remove video
        // await unlinkSync(mediaDownload.image.static.path);
        // await unlinkSync(mediaDownload.image.dynamic.path);
        // await unlinkSync(mediaDownload.video.watermarked.path);
        // await unlinkSync(mediaDownload.video.raw.path);

        return;
    },
}