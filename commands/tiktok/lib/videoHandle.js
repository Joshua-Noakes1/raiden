const lcl = require('cli-color'),
    videoData = require('./videoLib/videoData'),
    videoYTDLP = require('../../../bin/ytdlp/bin/ytdlpExec'),
    extractVideoData = require('./videoLib/extractVideoData'),
    downloadMedia = require('../../../bin/ytdlp/videos/downloadMedia'),
    embedColors = ['#FFB3BA', '#FFDFBA', '#FFE8B3', '#FFFFBA', '#E2FFBA', '#D0DDFF', '#E1BFFF'],
    {
        MessageEmbed
    } = require('discord.js'),
    {
        unlinkSync
    } = require('fs');

async function videoHandle(interaction, videoURL) {
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

    // loop over video data result and send embeds 
    await asyncForEach(videoDataResult.videos, async (video, index, array) => {
        console.log(lcl.blue("[TikTok - Info]"), `Downloading Video ${index + 1} of ${array.length}`);

        // extract video data
        const videoData = await extractVideoData(video);
        const attachments = [];

        // downloads videos is smaller then 8mb
        if (videoData.videos.watermarked.watermarkedSize >= 0 && videoData.videos.watermarked.watermarkedSize <= 8000000) {
            var videoWatermarked = await downloadMedia(videoData.videos.watermarked.watermarkedURL, videoData.videos.watermarked.watermarkedFormat);
            attachments.push({
                attachment: videoWatermarked.path,
                name: `${videoWatermarked.UUID}.${videoWatermarked.format}`
            });
        }
        if (videoData.videos.raw.rawSize >= 0 && videoData.videos.raw.rawSize <= 8000000) {
            var videoRaw = await downloadMedia(videoData.videos.raw.rawURL, videoData.videos.raw.rawFormat);
            attachments.push({
                attachment: videoRaw.path,
                name: `${videoRaw.UUID}.${videoRaw.format}`
            });
        }
        // download thumbnails
        var videoThumb = await downloadMedia(videoData.images.imageCover, 'png');
        attachments.push({
            attachment: videoThumb.path,
            name: `${videoThumb.UUID}.${videoThumb.format}`
        });
        var videoDynamicThumb = await downloadMedia(videoData.images.imageDynamic, 'gif');
        attachments.push({
            attachment: videoDynamicThumb.path,
            name: `${videoDynamicThumb.UUID}.${videoDynamicThumb.format}`
        });

        console.log(array.length);

        // create embed
        const videoEmbed = new MessageEmbed()
            .setTitle(`@${videoData.meta.author.authorUsername} (${videoData.meta.author.authorName} - ${videoData.meta.author.authorID} | ${array.length > 1 ? `Video ${index + 1} of ${array.length}` : ''})`)
            .setURL(videoData.meta.URL.video)
            .setColor(embedColors[index % embedColors.length])
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
                value: `${videoData.audio.audioTrackname}`,
                inline: true
            }, {
                name: "Track Album",
                value: `${videoData.audio.audioAlbum}`,
                inline: true
            }, {
                name: "Track Artist",
                value: `${videoData.audio.audioArtist}`,
                inline: true
            }])
            .setFooter(`Upload Date: ${videoData.meta.uploadDateTime.date}${videoData.meta.uploadDateTime.ordinal} ${videoData.meta.uploadDateTime.monthName} ${videoData.meta.uploadDateTime.year} ${videoData.meta.uploadDateTime.time.hour}:${videoData.meta.uploadDateTime.time.minutes}`)
            .setTimestamp();

        // send embed
        console.log(lcl.blue("[TikTok - Info]"), `Uploading embed, This may take a while...`);
        await interaction.followUp({
            embeds: [videoEmbed],
            files: attachments
        });
        console.log(lcl.green("[Tiktok - Success]"), `Embed ${index + 1} of ${array.length} sent successfully`);

        // delete media files
        await unlinkSync(videoThumb.path);
        await unlinkSync(videoDynamicThumb.path);
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