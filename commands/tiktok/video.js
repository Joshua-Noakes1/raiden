const lcl = require('cli-color'),
    path = require('path'),
    downloadCore = require('../../bin/ytdlp/download/ytdlpCore'),
    videoExec = require('../../bin/ytdlp/bin/ytdlpExec'),
    downloadMedia = require('../../bin/ytdlp/videos/downloadMedia'),
    getVideoData = require('./lib/getVideoData'),
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
        await interaction.deferReply();

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

        // store video urls etc and data 
        var tiktokVideoData = await getVideoData(tiktokVideoExec);

        console.log(tiktokVideoData);

        // try and download video
        var video = await downloadMedia(tiktokVideoData.video.video.watermarked.url, tiktokVideoData.video.video.watermarked.ext);
        var videoClean = await downloadMedia(tiktokVideoData.video.video.raw.url, tiktokVideoData.video.video.raw.ext);
        var cover = await downloadMedia(tiktokVideoData.video.images.cover, 'png');
        console.log(cover);

        // build video embed
        const videoEmbed = new MessageEmbed()
            .setTitle(`@${tiktokVideoData.video.meta.author.username} (${tiktokVideoData.video.meta.author.name} - ${tiktokVideoData.video. meta.author.id})`)
            .setURL(tiktokVideoData.video.meta.url)
            .setColor("#ff0000") // TODO - Make Random for the funny
            .setThumbnail(`attachment://${cover.videoUUID}.png`)
            .addFields({
                name: "Creator Username",
                value: `${tiktokVideoData.video.meta.author.username}`,
                inline: true
            }, {
                name: "Creator Name",
                value: `${tiktokVideoData.video.meta.author.name}`,
                inline: true
            }, {
                name: "Upload Date",
                value: `${tiktokVideoData.video.meta.uploadDate.date}/${tiktokVideoData.video.meta.uploadDate.month}/${tiktokVideoData.video.meta.uploadDate.year} ${tiktokVideoData.video.meta.uploadDate.time.hour}:${tiktokVideoData.video.meta.uploadDate.time.minutes}`,
                inline: true
            })
            .addFields({
                name: "Video Views",
                value: `${tiktokVideoData.video.meta.viewCount}`,
                inline: true
            }, {
                name: "Video Likes",
                value: `${tiktokVideoData.video.meta.likeCount}`,
                inline: true
            }, {
                name: "Video Comment(s)",
                value: `${tiktokVideoData.video.meta.commentCount}`,
                inline: true
            })
            .addFields({
                name: "Track Name",
                value: `${tiktokVideoData.video.audio.trackname}`,
                inline: true
            }, {
                name: "Track Album",
                value: `${tiktokVideoData.video.audio.album}`,
                inline: true
            }, {
                name: "Track Artist",
                value: `${tiktokVideoData.video.audio.artist}`,
                inline: true
            })
            .setTimestamp();
        // test
        await interaction.editReply({
            embeds: [videoEmbed],
            files: [{
                attachment: cover.path,
                name: `${cover.videoUUID}.${cover.ext}`
            }, {
                attachment: video.path,
                name: `${video.videoUUID}.${video.ext}`
            }, {
                attachment: videoClean.path,
                name: `${videoClean.videoUUID}.${videoClean.ext}`
            }]
        });

        //remove video
        await unlinkSync(video.path);
        await unlinkSync(videoClean.path);
        await unlinkSync(cover.path);

        return;
    },
}