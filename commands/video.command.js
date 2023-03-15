require('dotenv').config();
const lcl = require('cli-color');
const {
    youtube: youtubeHandler
} = require('./handler/handler');
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('video')
        .setDescription('Download a post from a supported site')
        .addStringOption(option => option.setName('url').setDescription('The URL of the post to download').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        const url = interaction.options.getString('url').toString();

        // check if URL is valid and not empty
        if (!/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(url) || url == "" || url == undefined) {
            console.log(lcl.red("[Video - Error]"), "Invalid URL provided.");
            const failedURLError = new EmbedBuilder()
                .setTitle("Please provide a valid URL")
                .setDescription("The URL you provided is not valid. Please make sure you are providing a valid URL.")
                .setColor("#ff6961")
                .setTimestamp();
            await interaction.editReply({
                embeds: [failedURLError]
            });
            return;
        }

        // check if URL is supported then extract video info from handler
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s\/?]*(\?.*)?$/i.test(url)) { // YouTube
            console.log(lcl.blue("[Video - Info]"), "YouTube URL provided.");
            var video = await youtubeHandler(url);
            if (!video.success) {
                console.log(lcl.red("[Video - Error]"), "Failed to download video info.");
                const failedVideoInfoError = new EmbedBuilder()
                    .setTitle("Failed to download video info")
                    .setDescription("Failed to download video info. Please try again later.")
                    .setColor("#ff6961")
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [failedVideoInfoError]
                });
                return;
            }

            var videoInfoEmbed = new EmbedBuilder()
                .setTitle(video.videoInfo.video.title)
                .setURL(video.videoInfo.video.url)
                .setAuthor({
                    name: video.videoInfo.creator.name,
                    iconURL: video.videoInfo.creator.avatar,
                    url: video.videoInfo.creator.url
                })
                .setDescription(video.videoInfo.video.description)
                .setThumbnail(video.videoInfo.video.thumbnail)
                .setColor("#ff6961")
                .setTimestamp();

            var attachments = [];
            for (var videoMedia of video.videoInfo.media) {
                if (videoMedia.size < 8388608) {
                    attachments.push({
                        name: `${video.videoInfo.video.title}.${videoMedia.ext}`,
                        attachment: `${videoMedia.path}.${videoMedia.ext}`
                    });
                }

            }

            await interaction.editReply({
                embeds: [videoInfoEmbed],
                files: attachments
            });
            return;
        } else if (/^https?:\/\/(?:www\.)?reddit\.com/i.test(url)) { // Reddit
            console.log(lcl.blue("[Video - Info]"), "Reddit URL provided.");
            await interaction.editReply({
                content: "Reddit is currently not supported."
            });
            return;
        } else if (/^https?:\/\/(?:www\.)?twitter\.com/i.test(url)) { // Twitter
            console.log(lcl.blue("[Video - Info]"), "Twitter URL provided.");
            await interaction.editReply({
                content: "Twitter is currently not supported."
            });
            return;
        } else if (/^https?:\/\/(?:www\.)?instagram\.com/i.test(url)) { // Instagram
            console.log(lcl.blue("[Video - Info]"), "Instagram URL provided.");
            await interaction.editReply({
                content: "Instagram is currently not supported."
            });
            return;
        } else if (/^https?:\/\/clips\.twitch\.tv/i.test(url)) { // Twitch Clips 
            console.log(lcl.blue("[Video - Info]"), "Twitch clip URL provided.");
            await interaction.editReply({
                content: "Twitch clips are currently not supported."
            });
            return;
        } else if (/^https?:\/\/(?:www\.)?tiktok\.com/i.test(url)) { // TikTok - Final Supported Site
            console.log(lcl.blue("[Video - Info]"), "TikTok URL provided.");
            await interaction.editReply({
                content: "TikTok is currently not supported."
            });
            return;
        } else if (/^https?:\/\/(?:www\.)?twitch\.tv/i.test(url)) { // Twitch - Not supported, use clips domain
            console.log(lcl.red("[Video - Error]"), "Twitch URL provided.");
            const twitchUseClipsDomainEmbed = new EmbedBuilder()
                .setTitle("Twitch is not supported")
                .setDescription("Twitch is not supported, please use the [clips domain](https://clips.twitch.tv/) instead.")
                .setColor("#ff6961")
                .setTimestamp();
            await interaction.editReply({
                embeds: [twitchUseClipsDomainEmbed]
            });
            return;
        } else { // Unsupported site
            console.log(lcl.red("[Video - Error]"), "Unsupported URL provided.");
            const unsupportedURLError = new EmbedBuilder()
                .setTitle("Unsupported site")
                .setDescription("Raiden currently does not support this site, If the site has support in [yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) please open an [issue](https://github.com/Joshua-Noakes1/raiden/issues)")
                .setColor("#ff6961")
                .setTimestamp();
            await interaction.editReply({
                embeds: [unsupportedURLError]
            });
            return;
        }

        // We can send the video data down here hopefully if it comes back as a success
    }
}