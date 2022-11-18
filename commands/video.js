const lcl = require('cli-color');
const colorHex = require('../lib/color');
const getTikTok = require('../lib/fetchTikTok');
const downloadMedia = require('../lib/downloadMedia');
const findVideo = require('../lib/findVideo');
const getTime = require('../lib/getTime');
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const {
    mapLang,
    getLangMatch
} = require('../langs/getLangs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('video')
        .setNameLocalizations({ // This comes from Google Translate, so it may not be accurate. https://translate.google.com/?sl=en&tl=es&text=ping&op=translate&hl=en
            "es-ES": 'video',
        })
        .setDescription('Downloads all possible videos from a TikTok')
        .setDescriptionLocalizations({
            "es-ES": 'Descarga todos los vídeos posibles de un TikTok',
        })
        .addStringOption(option =>
            option.setName('url')
            .setNameLocalizations({
                "es-ES": 'url',
            })
            .setDescription('The URL of the TikTok Video')
            .setDescriptionLocalizations({
                "es-ES": 'La URL del vídeo de TikTok',
            })
            .setRequired(true)
        ),

    async execute(interaction) {
        // delay interaction so we have le time and get lang
        await interaction.deferReply({
            ephemeral: true
        });
        var lang = mapLang(interaction.locale);

        try {
            // check URL
            console.log(lcl.blue("[Video - Info]"), "Checking URL...");
            var url = interaction.options.getString('url').toString();
            if (url.match(/^(?:https?:\/\/)?(?:vm\.)?(?:www\.)?tiktok\.com/gm) == null || url == null || url == undefined || url == "") {
                const errorEmbed = new EmbedBuilder() // a68765ba-b7ad-43bb-9c3a-748e7bafba7e
                    .setTitle(getLangMatch("videoFailURLInvalid.title", lang.code))
                    .setDescription(getLangMatch("videoFailURLInvalid.description", lang.code))
                    .setColor("#ff6961")
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [errorEmbed]
                });
                return;
            }
            console.log(lcl.green("[Video - Success]"), "URL is valid.");

            // create initial embed - 327fe4d3-0986-435e-8d86-59785d86cde6
            const videoInitialEmbedP1 = new EmbedBuilder()
                .setTitle(getLangMatch("videoInitialEmbedP1.title", lang.code))
                .addFields([{
                        name: getLangMatch("videoInitialEmbedP1.urlTitle", lang.code),
                        value: getLangMatch("videoInitialEmbedP1.urlDesc", lang.code),
                        inline: true
                    },
                    {
                        name: getLangMatch("videoInitialEmbedP1.embedStuckTitle", lang.code),
                        value: getLangMatch("videoInitialEmbedP1.embedStuckDesc", lang.code),
                        inline: true
                    }
                ])
                .setColor(colorHex())
                .setTimestamp();
            await interaction.editReply({
                embeds: [videoInitialEmbedP1],
                ephemeral: true
            });

            // get TikTok
            console.log(lcl.blue("[Video - Info]"), "Getting TikTok...");
            var tikTokVideo = await getTikTok(url);
            if (!tikTokVideo.success) {
                // tiktok ytdlp failure - ee128fe2-bc0e-41a8-95b7-4872e32265f1
                const videoFailEmbed = new EmbedBuilder()
                    .setTitle(getLangMatch("videoYTDLPFailure.title", lang.code))
                    .setDescription(getLangMatch("videoYTDLPFailure.description", lang.code))
                    .setColor("#ff6961")
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [videoFailEmbed]
                });
                return;
            }
            console.log(lcl.green("[Video - Success]"), "Found TikTok.");

            // build video object
            var videoObject = {
                "account": {
                    "name": `${tikTokVideo.video.creator}`,
                    "username": `${tikTokVideo.video.uploader}`,
                    "id": `${tikTokVideo.video.uploader_id}`,
                    "uuid": `${tikTokVideo.video.uploader_url.toString().split("/@")[1]}`,
                    "url": `${tikTokVideo.video.uploader_url}`,
                },
                "video": {
                    "id": `${tikTokVideo.video.id}`,
                    "description": `${tikTokVideo.video.title.toString().replace(/\s+$/, '')}`,
                    "url": `${tikTokVideo.video.uploader_url}/video/${tikTokVideo.video.id}`,
                    "uploadTime": await getTime(Math.floor(tikTokVideo.video.timestamp * 1000)),
                    "stats": {
                        "views": `${tikTokVideo.video.view_count}`,
                        "likes": `${tikTokVideo.video.like_count}`,
                        "comments": `${tikTokVideo.video.comment_count}`,
                        "reposts": `${tikTokVideo.video.repost_count}`,
                    },
                    "media": {
                        "watermark": {
                            "url": "",
                            "filesize": 0, // In Bytes
                            "tooBig": false,
                            "format": ""
                        },
                        "clean": {
                            "url": "",
                            "filesize": 0, // In Bytes
                            "tooBig": false,
                            "format": ""
                        }
                    },
                    "thumbnail": {
                        "dynamic": {
                            "url": "",
                            "format": ""
                        },
                        "static": {
                            "url": "",
                            "format": ""
                        }
                    }
                }
            }

            // find videos
            console.log(lcl.blue("[Video - Info]"), "Finding watermarkd video...");
            var watermarkVideo = await findVideo("watermark", tikTokVideo.video.formats);
            if (watermarkVideo.success) {
                videoObject.video.media.watermark.url = watermarkVideo.url;
                videoObject.video.media.watermark.filesize = watermarkVideo.filesize;
                videoObject.video.media.watermark.tooBig = watermarkVideo.filesize >= 8000000 ? true : false;
                videoObject.video.media.watermark.format = watermarkVideo.format;
                console.log(lcl.green("[Video - Success]"), "Found watermarkd video.");
            } else {
                console.log(lcl.red("[Video - Error]"), "Could not find watermarked video.");
            }


            console.log(lcl.blue("[Video - Info]"), "Finding clean video...");
            var cleanVideo = await findVideo("clean", tikTokVideo.video.formats);
            if (cleanVideo.success) {
                videoObject.video.media.clean.url = cleanVideo.url;
                videoObject.video.media.clean.filesize = cleanVideo.filesize;
                videoObject.video.media.clean.tooBig = cleanVideo.filesize >= 8000000 ? true : false;
                videoObject.video.media.clean.format = cleanVideo.format;
                console.log(lcl.green("[Video - Success]"), "Found clean video.");
            } else {
                console.log(lcl.red("[Video - Error]"), "Could not find clean video.");
            }



            console.log(videoObject);

            // var mediaTest = await downloadMedia(tikTokVideo.video.formats[0].url, tikTokVideo.video.formats[0].video_ext);
            // console.log(mediaTest);

            // console.log(tikTokVideo);

        } catch (err) {
            // something went wrong - 5d36cc82-cd48-4a8b-b859-5ddffb7a63f2
            const somethingWentWrongEmbed = new EmbedBuilder()
                .setTitle(getLangMatch("videoSomethingWentWrong.title", lang.code))
                .setDescription(getLangMatch("videoSomethingWentWrong.description", lang.code))
                .setColor("#ff6961")
                .setTimestamp();
            await interaction.editReply({
                embeds: [somethingWentWrongEmbed]
            });

            console.log(lcl.red("[Discord - Error]"), err.message);
            return console.log(lcl.red("[Discord - Error]"), err.stack);
        }
    }
}