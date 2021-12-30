const lcl = require('cli-color'),
    path = require('path'),
    {
        MessageEmbed
    } = require('discord.js');

async function sendVideoEmbed(interaction) {
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
}

module.exports = sendVideoEmbed;