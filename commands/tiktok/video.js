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
            .setTitle('Info - Video URL')
            .setDescription('The video URL might look strange, but it does work!\n If the user changes their username this url should still point to the video')
            .setColor('#00ff00')
            .setTimestamp();
        await interaction.editReply({
            embeds: [videoURLEmbed],
            ephemeral: true
        });

        // build video embed
        const videoEmbed = new MessageEmbed()
            .setTitle(`@${tiktokVideoData.video.meta.author.username} (${tiktokVideoData.video.meta.author.name} - ${tiktokVideoData.video. meta.author.id})`)
            .setURL(tiktokVideoData.video.meta.url)
            .setColor("#ff0000") // TODO - Make Random for the funny
            .setThumbnail(`attachment://${mediaDownload.image.static.videoUUID}.${mediaDownload.image.static.ext}`)
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
        await interaction.followUp({
            embeds: [videoEmbed],
            files: [{
                attachment: mediaDownload.image.static.path,
                name: `${mediaDownload.image.static.videoUUID}.${mediaDownload.image.static.ext}`
            }, {
                attachment: mediaDownload.image.dynamic.path,
                name: `${mediaDownload.image.dynamic.videoUUID}.${mediaDownload.image.dynamic.ext}`
            }, {
                attachment: mediaDownload.video.watermarked.path,
                name: `${mediaDownload.video.watermarked.videoUUID}.${mediaDownload.video.watermarked.ext}`
            }, {
                attachment: mediaDownload.video.raw.path,
                name: `${mediaDownload.video.raw.videoUUID}.${mediaDownload.video.raw.ext}`
            }]
        });

        //remove video
        // await unlinkSync(mediaDownload.image.static.path);
        // await unlinkSync(mediaDownload.image.dynamic.path);
        // await unlinkSync(mediaDownload.video.watermarked.path);
        // await unlinkSync(mediaDownload.video.raw.path);

        return;
    },
}