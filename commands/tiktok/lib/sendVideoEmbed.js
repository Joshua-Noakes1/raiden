const lcl = require('cli-color'),
    {
        unlinkSync
    } = require('fs'),
    {
        MessageEmbed
    } = require('discord.js');

async function sendVideoEmbed(interaction, tiktokVideoData, mediaDownload) {
    console.log(lcl.blue("[Discord - Info]"), `Sending video embed... (ID: ${tiktokVideoData.video.meta.videoID})`);

    // embed colors
    var embedColor = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];

    // build video embed
    const videoEmbed = new MessageEmbed()
        .setTitle(`@${tiktokVideoData.video.meta.author.username} (${tiktokVideoData.video.meta.author.name} - ${tiktokVideoData.video. meta.author.id})`)
        .setURL(tiktokVideoData.video.meta.url)
        .setColor(embedColor[Math.floor(Math.random() * embedColor.length)])
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
            value: `${tiktokVideoData.video.meta.uploadDate.date}/${tiktokVideoData.video.meta.uploadDate.month}/${tiktokVideoData.video.meta.uploadDate.year} ${tiktokVideoData.video.meta.uploadDate.time.hour}:${tiktokVideoData.video.meta.uploadDate.time.minutes} (UTC)`,
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

    // build embed
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
    await unlinkSync(mediaDownload.image.static.path);
    await unlinkSync(mediaDownload.image.dynamic.path);
    await unlinkSync(mediaDownload.video.watermarked.path);
    await unlinkSync(mediaDownload.video.raw.path);
}

module.exports = sendVideoEmbed;