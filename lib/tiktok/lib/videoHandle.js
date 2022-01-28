const lcl = require('cli-color'),
    path = require('path'),
    webpToGIF = require('./videoLib/webpToGIF'),
    videoData = require('./videoLib/videoData'),
    videoYTDLP = require('../../../bin/ytdlp/bin/ytdlpExec'),
    extractVideoData = require('./videoLib/extractVideoData'),
    downloadMedia = require('../../../bin/ytdlp/videos/downloadMedia'),
    checkUploadSize = require('./videoLib/upload/checkUploadSize'),
    embedColors = ['#FFB3BA', '#FFDFBA', '#FFE8B3', '#FFFFBA', '#E2FFBA', '#D0DDFF', '#E1BFFF'],
    {
        MessageEmbed
    } = require('discord.js'),
    {
        unlinkSync
    } = require('fs');

async function videoHandle(interaction, videoURL, callType, oldestFirst) {
    // fetch video info
    const tiktokVideoExec = await videoYTDLP(videoURL);
    if (tiktokVideoExec.success == false) {
        const videoURLErrorEmbed = new MessageEmbed()
            .setTitle("Video URL Error")
            .setDescription("Failed to fetch video, Please try again...")
            .setColor("#ff0000")
            .setTimestamp();
        // return error embed
        await interaction.editReply({
            embeds: [videoURLErrorEmbed]
        });
        return;
    }

    // get video data
    const videoDataResult = await videoData(tiktokVideoExec);
    if (videoDataResult.success == false) {
        const videoURLErrorEmbed = new MessageEmbed()
            .setTitle("Video Sort Error")
            .setDescription("Failed to sort video, Please try again...")
            .setColor("#ff0000")
            .setTimestamp();
        // return error embed
        await interaction.editReply({
            embeds: [videoURLErrorEmbed]
        });
        return;
    }

    // /video and /account commands
    if (callType != videoDataResult.type) {
        switch (callType) {
            case 'video':
                var videoErrorEmbed = new MessageEmbed()
                    .setTitle("Video Type Error")
                    .setDescription("Use /account to get a list of videos")
                    .setColor("#ff0000")
                    .setTimestamp();
                break;
            case 'account':
                var videoErrorEmbed = new MessageEmbed()
                    .setTitle("Video Type Error")
                    .setDescription("Use /video to get a single video")
                    .setColor("#ff0000")
                    .setTimestamp();
                break;

        }

        await interaction.editReply({
            embeds: [videoErrorEmbed]
        });
        return;
    }

    // flip array if oldest first
    if (oldestFirst) videoDataResult.videos.reverse();

    // loop over video data result and send embeds 
    await asyncForEach(videoDataResult.videos, async (video, index, array) => {
        console.log(lcl.blue("[TikTok - Info]"), `Downloading Video ${index + 1} of ${array.length}`);

        // extract video data
        const videoData = await extractVideoData(video);
        const attachments = [];

        // download thumbnails
        var videoThumb = await downloadMedia(videoData.images.imageCover, 'png');
        attachments.push({
            attachment: videoThumb.path,
            name: `${videoThumb.UUID}.${videoThumb.format}`
        });

        // webp wont play in discord so we need to download it and convert it to gif
        var videoDynamicThumb = await downloadMedia(videoData.images.imageDynamic, 'webp');
        var videoDynamicWebP = await webpToGIF(videoDynamicThumb.path, videoDynamicThumb.UUID, path.join(videoDynamicThumb.pathFolder, `${videoDynamicThumb.UUID}.gif`));
        var dynamicThumb = {
            attachment: videoDynamicThumb.path,
            name: `${videoDynamicThumb.UUID}.${videoDynamicThumb.format}`
        }
        if (videoDynamicWebP.success) {
            dynamicThumb.attachment = videoDynamicWebP.path;
            dynamicThumb.name = `${videoDynamicThumb.UUID}.gif`;
        }
        attachments.push(dynamicThumb);

        // downloads videos
        var videoWatermarked = await downloadMedia(videoData.videos.watermarked.watermarkedURL, videoData.videos.watermarked.watermarkedFormat);
        attachments.push({
            attachment: videoWatermarked.path,
            name: `${videoWatermarked.UUID}.${videoWatermarked.format}`
        });
        var videoRaw = await downloadMedia(videoData.videos.raw.rawURL, videoData.videos.raw.rawFormat);
        attachments.push({
            attachment: videoRaw.path,
            name: `${videoRaw.UUID}.${videoRaw.format}`
        });

        // check attachment size
        var checkedAttachments = await checkUploadSize(attachments);
        if (checkedAttachments.success == false) {
            const videoSizeErrorEmbed = new MessageEmbed()
                .setTitle("Videos Too Large")
                .setDescription("Videos are too large to upload, Please try again...")
                .setColor("#ff0000")
                .setTimestamp();
            // return error embed
            await interaction.editReply({
                embeds: [videoSizeErrorEmbed]
            });
        }

        // create embed
        const videoEmbed = new MessageEmbed()
            .setTitle(`@${videoData.meta.author.authorUsername} (${videoData.meta.author.authorName} - ${videoData.meta.author.authorID}${array.length > 1 ? ` | Video ${index + 1} of ${array.length}` : ''})`)
            .setDescription(videoData.meta.videoTitle)
            .setURL(videoData.meta.URL.video)
            .setColor(embedColors[Math.floor(Math.random() * embedColors.length)])
            .setThumbnail(`attachment://${videoThumb.UUID}.${videoThumb.format}`)
            .addFields([{
                name: "Creator Username",
                value: `${videoData.meta.author.authorUsername}`,
                inline: true
            }, {
                name: "Creator Name",
                value: `${videoData.meta.author.authorName}`,
                inline: true
            }, {
                name: "\u200b",
                value: "\u200b",
                inline: true
            }])
            .addFields([{
                name: "Video Views",
                value: `${videoData.meta.viewCount}`,
                inline: true
            }, {
                name: "Video Likes",
                value: `${videoData.meta.likeCount}`,
                inline: true
            }, {
                name: "Video Comments",
                value: `${videoData.meta.commentCount}`,
                inline: true
            }])
            .addFields([{
                name: "Track Name",
                value: `${videoData.audio.audioTrackname != null ? videoData.audio.audioTrackname : 'Unknown'}`,
                inline: true
            }, {
                name: "Track Album",
                value: `${videoData.audio.audioAlbum != null ? videoData.audio.audioAlbum : 'Unknown'}`,
                inline: true
            }, {
                name: "Track Artist",
                value: `${videoData.audio.audioArtist != null ? videoData.audio.audioArtist : 'Unknown'}`,
                inline: true
            }])
            .setFooter(`Upload Date: ${videoData.meta.uploadDateTime.date}${videoData.meta.uploadDateTime.ordinal} ${videoData.meta.uploadDateTime.monthName} ${videoData.meta.uploadDateTime.year} ${videoData.meta.uploadDateTime.time.hour}:${videoData.meta.uploadDateTime.time.minutes}`)
            .setTimestamp();

        // send embed
        try {
            console.log(lcl.blue("[TikTok - Info]"), `Uploading embed, This may take a while...`);
            if (checkedAttachments.attachments.length < 4) await interaction.followUp({
                content: `**All videos were too large to upload so TikTok\'s watermarked video has been removed**${array.length > 1 ? ` (Video ${index + 1} of ${array.length})` : ''}`,
                ephemeral: true
            });
            await interaction.followUp({
                embeds: [videoEmbed],
                files: checkedAttachments.attachments
            });
            console.log(lcl.green("[Tiktok - Success]"), `Embed ${index + 1} of ${array.length} sent successfully`);
        } catch (error) {
            console.log(lcl.red("[TikTok - Error]"), `Failed to send embed ${index + 1} of ${array.length}`);
            console.log(lcl.red("[TikTok - Error]"), error);
            const videoErrorEmbed = new MessageEmbed()
                .setTitle(`Video Embed Error${array.length > 1 ? ` (Video ${index + 1} of ${array.length})` : ''}`)
                .setURL(videoEmbed.url)
                .setDescription("Failed to send embed, Please try again...")
                .setColor("#ff0000")
                .setTimestamp();
            await interaction.followUp({
                embeds: [videoErrorEmbed]
            });
        }

        // delete media files
        await unlinkSync(videoThumb.path);
        await unlinkSync(videoDynamicThumb.path);
        await unlinkSync(videoDynamicWebP.path);
        await unlinkSync(videoWatermarked.path);
        await unlinkSync(videoRaw.path);
    });

    return {
        success: true
    };
}

// fix callback hell 
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = videoHandle;