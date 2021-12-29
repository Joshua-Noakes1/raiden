const lcl = require('cli-color'),
    path = require('path'),
    downloadCore = require('../../bin/ytdlp/download/ytdlpCore'),
    videoExec = require('../../bin/ytdlp/bin/ytdlpExec'),
    downloadVideo = require('../../bin/ytdlp/videos/downloadVideo'),
    dateTime = require('../../bin/dateTime'),
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
            await interaction.editReply({
                embeds: [ytdlpErrorEmbed]
            });
            return;
        }

        // get video info
        console.log(lcl.blue("[Discord - Info]"), "Getting video info...");
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
        var tiktokVideoData = {
            video: {
                meta: {
                    author: {
                        username: tiktokVideoExec.videoResult.uploader,
                        name: tiktokVideoExec.videoResult.creator,
                        id: tiktokVideoExec.videoResult.uploader_id
                    },
                    title: tiktokVideoExec.videoResult.title,
                    url: `https://www.tiktok.com/@${tiktokVideoExec.videoResult.uploader}/video/${tiktokVideoExec.videoResult.id}`,
                    viewCount: tiktokVideoExec.videoResult.view_count,
                    likeCount: tiktokVideoExec.videoResult.like_count,
                    commentCount: tiktokVideoExec.videoResult.comment_count,
                    repostCount: tiktokVideoExec.videoResult.repost_count,
                    uploadDate: await dateTime(tiktokVideoExec.videoResult.timestamp)
                },
                video: {

                },
                images: {

                },
                audio: {

                }
            }
        };

        console.log(tiktokVideoExec.videoResult)

        // try and download video
        var video = await downloadVideo(tiktokVideoExec.videoResult.formats[0].url);
        console.log(video);

        // build video embed
        const videoEmbed = new MessageEmbed()
            .setTitle(`@${tiktokVideoData.video.meta.author.username} (${tiktokVideoData.video. meta.author.id})`)
            .setURL(tiktokVideoData.video.meta.url)
            .setColor("#ff0000") // TODO - Make Random for the funny
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
            .setTimestamp();
        // test
        await interaction.editReply({
            embeds: [videoEmbed],
            files: [{
                attachment: video.path,
                name: `${video.videoUUID}.mp4`
            }]
        });

        //remove video
        await unlinkSync(video.path);

        return;
    },
}