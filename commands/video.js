const lcl = require('cli-color');
const colorHex = require('../lib/color');
const getTikTok = require('../lib/fetchTikTok');
const downloadMedia = require('../lib/downloadMedia');
const findVideo = require('../lib/findVideo');
const findThumbnail = require('../lib/findThumbnail');
const webpGif = require('../lib/webpToGif');
const getTime = require('../lib/getTime');
const clearDownloads = require('../lib/clearDownloads');
const cloudinaryUpload = require('../lib/cloudinaryUpload');
const {
    unlinkSync
} = require('fs');
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

        // clear downloads
        await clearDownloads();

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
            // p2 - aec6a50e-5062-43cc-9187-683d09763522
            const videoEditEmbedP2 = new EmbedBuilder()
                .setTitle(getLangMatch("videoEditEmbedP2.title", lang.code))
                .setDescription(getLangMatch("videoEditEmbedP2.description", lang.code))
                .setColor(colorHex())
                .setTimestamp();
            await interaction.editReply({
                embeds: [videoEditEmbedP2],
                ephemeral: true
            });

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
                        "views": `${tikTokVideo.video.view_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                        "likes": `${tikTokVideo.video.like_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                        "comments": `${tikTokVideo.video.comment_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                        "reposts": `${tikTokVideo.video.repost_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                    },
                    "media": {
                        "watermark": {
                            "url": "",
                            "fileName": "",
                            "filesize": 0, // In Bytes
                            "tooBig": false,
                            "usingCloud": false,
                            "format": "",
                            "download": {
                                "success": false,
                                "url": "",
                                "path": ""
                            }
                        },
                        "clean": {
                            "url": "",
                            "fileName": "",
                            "filesize": 0, // In Bytes
                            "tooBig": false,
                            "usingCloud": false,
                            "format": "",
                            "download": {
                                "success": false,
                                "url": "",
                                "path": ""
                            }
                        }
                    },
                    "thumbnail": {
                        "dynamic": {
                            "success": false,
                            "fileName": "",
                            "url": "",
                            "format": "",
                            "download": {
                                "success": false,
                                "path": ""
                            }
                        },
                        "static": {
                            "success": false,
                            "fileName": "",
                            "url": "",
                            "format": "",
                            "download": {
                                "success": false,
                                "path": ""
                            }
                        }
                    },
                    "cloudUpload": []
                },
                "audio": {
                    "track": `${tikTokVideo.video.track || "Unknown"}`,
                    "artist": `${tikTokVideo.video.artist || "Unknown"}`,
                    "album": `${tikTokVideo.video.album || "Unknown"}`,
                }
            }

            // find videos
            // p3 - 6dcb268d-cb86-4af1-b9f9-2c6277fffa9e
            const videoEditEmbedP3 = new EmbedBuilder()
                .setTitle(getLangMatch("videoEditEmbedP3.title", lang.code))
                .setDescription(getLangMatch("videoEditEmbedP3.description", lang.code))
                .setColor(colorHex())
                .setTimestamp();
            await interaction.editReply({
                embeds: [videoEditEmbedP3],
                ephemeral: true
            });
            console.log(lcl.blue("[Video - Info]"), "Finding watermarkd video...");
            var watermarkVideo = await findVideo("watermark", tikTokVideo.video.formats);
            if (watermarkVideo.success) {
                videoObject.video.media.watermark.url = watermarkVideo.url;
                videoObject.video.media.watermark.filesize = watermarkVideo.size;
                videoObject.video.media.watermark.tooBig = watermarkVideo.size >= 8000000 ? true : false;
                videoObject.video.media.watermark.format = watermarkVideo.format;
                console.log(lcl.green("[Video - Success]"), "Found watermarkd video.");
            } else {
                console.log(lcl.red("[Video - Error]"), "Could not find watermarked video.");
            }


            console.log(lcl.blue("[Video - Info]"), "Finding clean video...");
            var cleanVideo = await findVideo("clean", tikTokVideo.video.formats);
            if (cleanVideo.success) {
                videoObject.video.media.clean.url = cleanVideo.url;
                videoObject.video.media.clean.filesize = cleanVideo.size;
                videoObject.video.media.clean.tooBig = cleanVideo.size >= 8000000 ? true : false;
                videoObject.video.media.clean.format = cleanVideo.format;
                console.log(lcl.green("[Video - Success]"), "Found clean video.");
            } else {
                console.log(lcl.red("[Video - Error]"), "Could not find clean video.");
            }
            if (!watermarkVideo.success && !cleanVideo.success) {
                // no videos found - f5e8edff-2b89-496f-a52a-e61151952ffa
                console.log(lcl.red("[Video - Error]"), "Could not find any videos.");
                const videoFailEmbed = new EmbedBuilder()
                    .setTitle(getLangMatch("videoNoVideosFound.title", lang.code))
                    .setDescription(getLangMatch("videoNoVideosFound.description", lang.code))
                    .setColor("#ff6961")
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [videoFailEmbed]
                });
                return;
            } else {
                console.log(lcl.green("[Video - Success]"), "Found videos.");
            }

            // find thumbnails
            console.log(lcl.blue("[Video - Info]"), "Finding dynamic thumbnail...");
            var dynamicThumbnail = await findThumbnail(tikTokVideo.video.thumbnails, "dynamic");
            if (dynamicThumbnail.success) {
                videoObject.video.thumbnail.dynamic.success = true;
                videoObject.video.thumbnail.dynamic.url = dynamicThumbnail.url;
                videoObject.video.thumbnail.dynamic.format = "webp";
                console.log(lcl.green("[Video - Success]"), "Found dynamic thumbnail.");
            } else {
                console.log(lcl.red("[Video - Error]"), "Could not find dynamic thumbnail.");
            }

            console.log(lcl.blue("[Video - Info]"), "Finding static thumbnail...");
            var staticThumbnail = await findThumbnail(tikTokVideo.video.thumbnails, "static");
            if (staticThumbnail.success) {
                videoObject.video.thumbnail.static.success = true;
                videoObject.video.thumbnail.static.url = staticThumbnail.url;
                videoObject.video.thumbnail.static.format = "jpeg";
                console.log(lcl.green("[Video - Success]"), "Found static thumbnail.");
            } else {
                console.log(lcl.red("[Video - Error]"), "Could not find static thumbnail.");
            }
            // check if static image exists if not replace with non found image
            if (!staticThumbnail.success) {
                console.log(lcl.yellow("[Video - Warn]"), "Could not find static thumbnail, using fallback.");
                videoObject.video.thumbnail.static.success = true;
                videoObject.video.thumbnail.static.url = "https://i.imgur.com/3AUSafG.png";
                videoObject.video.thumbnail.static.format = "png";
            }

            // attempt to download medua
            // p4 - 2f4ecbf8-4709-4f8f-bb7c-f97ddbb984c8
            const videoEditEmbedP4 = new EmbedBuilder()
                .setTitle(getLangMatch("videoEditEmbedP4.title", lang.code))
                .setDescription(getLangMatch("videoEditEmbedP4.description", lang.code))
                .setColor(colorHex())
                .setTimestamp();
            await interaction.editReply({
                embeds: [videoEditEmbedP4],
                ephemeral: true
            });

            console.log(lcl.blue("[Video - Info]"), "Attempting to download media...");
            if (watermarkVideo.success) {
                console.log(lcl.blue("[Video - Info]"), "Downloading watermarkd video...");
                var watermarkVideoDownload = await downloadMedia(videoObject.video.media.watermark.url, watermarkVideo.format);
                if (watermarkVideoDownload.success) {
                    videoObject.video.media.watermark.download.success = true;
                    videoObject.video.media.watermark.download.path = watermarkVideoDownload.filePath;
                    videoObject.video.media.watermark.fileName = watermarkVideoDownload.uuid;
                    console.log(lcl.green("[Video - Success]"), "Downloaded watermarkd video.");
                } else {
                    console.log(lcl.red("[Video - Error]"), "Could not download watermarkd video.");
                }
            }
            if (cleanVideo.success) {
                console.log(lcl.blue("[Video - Info]"), "Downloading clean video...");
                var cleanVideoDownload = await downloadMedia(videoObject.video.media.clean.url, cleanVideo.format);
                if (cleanVideoDownload.success) {
                    videoObject.video.media.clean.download.success = true;
                    videoObject.video.media.clean.download.path = cleanVideoDownload.filePath;
                    videoObject.video.media.clean.fileName = cleanVideoDownload.uuid;
                    console.log(lcl.green("[Video - Success]"), "Downloaded clean video.");
                } else {
                    console.log(lcl.red("[Video - Error]"), "Could not download clean video.");
                }
            }

            if (dynamicThumbnail.success) {
                console.log(lcl.blue("[Video - Info]"), "Downloading dynamic thumbnail...");
                var dynamicThumbnailDownload = await downloadMedia(videoObject.video.thumbnail.dynamic.url, "webp");
                if (dynamicThumbnailDownload.success) {
                    // attempt to convert to gif
                    console.log(lcl.green("[Video - Success]"), "Downloaded dynamic thumbnail.");
                    console.log(lcl.blue("[Video - Info]"), "Converting dynamic thumbnail to gif...");
                    var dynamicThumbnailConvert = await webpGif(dynamicThumbnailDownload.filePath, dynamicThumbnailDownload.gifPath);
                    if (dynamicThumbnailConvert.success) {
                        videoObject.video.thumbnail.dynamic.download.success = true;
                        videoObject.video.thumbnail.dynamic.format = "gif";
                        videoObject.video.thumbnail.dynamic.download.path = dynamicThumbnailDownload.gifPath;
                        videoObject.video.thumbnail.dynamic.fileName = dynamicThumbnailDownload.uuid;
                        await unlinkSync(dynamicThumbnailDownload.filePath);
                        console.log(lcl.green("[Video - Success]"), "Converted dynamic thumbnail to gif.");
                    }
                } else {
                    console.log(lcl.red("[Video - Error]"), "Could not download dynamic thumbnail.");
                }
            }
            if (staticThumbnail.success) {
                console.log(lcl.blue("[Video - Info]"), "Downloading static thumbnail...");
                var staticThumbnailDownload = await downloadMedia(videoObject.video.thumbnail.static.url, "jpeg");
                if (staticThumbnailDownload.success) {
                    videoObject.video.thumbnail.static.download.success = true;
                    videoObject.video.thumbnail.static.download.path = staticThumbnailDownload.filePath;
                    videoObject.video.thumbnail.static.fileName = staticThumbnailDownload.uuid;
                    console.log(lcl.green("[Video - Success]"), "Downloaded static thumbnail.");
                } else {
                    console.log(lcl.red("[Video - Error]"), "Could not download static thumbnail.");
                }
            }
            console.log(lcl.green("[Video - Success]"), "Downloaded media.");

            // check filesize added
            if (Math.floor(videoObject.video.media.watermark.filesize + videoObject.video.media.clean.filesize >= 8000000)) {
                console.log(lcl.yellow("[Video - Warn]"), "Videos are too large together, forcing videos as \"tooBig\"");
                videoObject.video.media.watermark.tooBig = true;
                videoObject.video.media.clean.tooBig = true;
            }

            // upload to cloudinary if video is too big
            if (videoObject.video.media.watermark.tooBig || videoObject.video.media.clean.tooBig) {
                // p5 - 70ed8cf2-f11c-4808-90a8-c5fb47a1459e
                const videoEditEmbedP5 = new EmbedBuilder()
                    .setTitle(getLangMatch("videoEditEmbedP5.title", lang.code))
                    .setDescription(getLangMatch("videoEditEmbedP5.description", lang.code))
                    .setColor(colorHex())
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [videoEditEmbedP5],
                    ephemeral: true
                });
            }
            if (videoObject.video.media.watermark.tooBig && videoObject.video.media.watermark.download.success) {
                // upload to cloud
                console.log(lcl.blue("[Video - Info]"), "Uploading watermarked to cloud...");
                var watermarkVideoUpload = await cloudinaryUpload(videoObject.video.media.watermark.download.path, videoObject.video.media.watermark.fileName);
                if (watermarkVideoUpload.success) {
                    videoObject.video.media.watermark.usingCloud = true;
                    videoObject.video.media.watermark.download.url = watermarkVideoUpload.url;
                    videoObject.video.cloudUpload.push({
                        "type": "watermark",
                        "langStr": "cloudinaryUploadString.watermark",
                        "url": watermarkVideoUpload.url
                    })
                    console.log(lcl.green("[Video - Success]"), "Uploaded watermarked to cloud.");
                }
            }
            if (videoObject.video.media.clean.tooBig && videoObject.video.media.clean.download.success) {
                // upload to cloud
                console.log(lcl.blue("[Video - Info]"), "Uploading clean to cloud...");
                var cleanVideoUpload = await cloudinaryUpload(videoObject.video.media.clean.download.path, videoObject.video.media.clean.fileName);
                if (cleanVideoUpload.success) {
                    videoObject.video.media.clean.usingCloud = true;
                    videoObject.video.media.clean.download.url = cleanVideoUpload.url;
                    videoObject.video.cloudUpload.push({
                        "type": "clean",
                        "langStr": "cloudinaryUploadString.clean",
                        "url": cleanVideoUpload.url
                    })
                    console.log(lcl.green("[Video - Success]"), "Uploaded clean to cloud.");
                }
            }

            // add attachments to video upload object
            var attachments = [];

            // add all attachments to array if not in cloud
            if (videoObject.video.thumbnail.static.download.success) {
                attachments.push({
                    "name": `${videoObject.video.thumbnail.static.fileName}.${videoObject.video.thumbnail.static.format}`,
                    "attachment": videoObject.video.thumbnail.static.download.path
                })
            }
            if (videoObject.video.thumbnail.dynamic.download.success) {
                attachments.push({
                    "name": `${videoObject.video.thumbnail.dynamic.fileName}.${videoObject.video.thumbnail.dynamic.format}`,
                    "attachment": videoObject.video.thumbnail.dynamic.download.path
                })
            }
            if (videoObject.video.media.watermark.download.success && !videoObject.video.media.watermark.usingCloud) {
                attachments.push({
                    "name": `${videoObject.video.media.watermark.fileName}.${videoObject.video.media.watermark.format}`,
                    "attachment": videoObject.video.media.watermark.download.path
                })
            }
            if (videoObject.video.media.clean.download.success && !videoObject.video.media.clean.usingCloud) {
                attachments.push({
                    "name": `${videoObject.video.media.clean.fileName}.${videoObject.video.media.clean.format}`,
                    "attachment": videoObject.video.media.clean.download.path
                })
            }

            // send attachemtnts to discord
            // p6 - 7c1947a3-f36a-4026-b997-7a37254c1dc0
            const videoEditEmbedP6 = new EmbedBuilder()
                .setTitle(getLangMatch("videoEditEmbedP6.title", lang.code))
                .setDescription(getLangMatch("videoEditEmbedP6.description", lang.code))
                .setColor(colorHex())
                .setTimestamp();
            await interaction.editReply({
                embeds: [videoEditEmbedP6],
                ephemeral: true
            });

            if (attachments.length != 4) {
                console.log(lcl.yellow("[Video - Warn]"), "Not all media has been included within Discord, some may be within cloudinary.");
                if (videoObject.video.cloudUpload.length > 0) {
                    console.log(lcl.blue("[Video - Info]"), "Sending cloudinary links to Discord...");
                    var cloudString = `${getLangMatch("cloudinaryUploadString.default", lang.code)}\n`; // 075fbcc8-3e06-4f33-885e-4d68e81beab3
                    for (const cloudVid in videoObject.video.cloudUpload) {
                        cloudString += `**[${getLangMatch(videoObject.video.cloudUpload[cloudVid].langStr, lang.code)}](${videoObject.video.cloudUpload[cloudVid].url})**\n`;
                    }
                    await interaction.followUp({
                        "content": cloudString
                    });
                    console.log(lcl.green("[Video - Success]"), "Sent cloudinary links to Discord.");
                }
            }

            // build final embed
            console.log(lcl.blue("[Video - Info]"), "Building final embed...");
            const videoFinalEmbed = new EmbedBuilder() // 79e91619-f6f1-4397-82c9-cabd195ade4a - Pxx
                .setTitle(`@${videoObject.account.username} (${videoObject.account.name} - ${videoObject.account.id})`)
                .setURL(`${videoObject.video.url}`)
                .setDescription(`${videoObject.video.description}`)
                .setColor(colorHex())
                .setThumbnail(`attachment://${videoObject.video.thumbnail.static.fileName}.${videoObject.video.thumbnail.static.format}`)
                .addFields([{
                        name: `${getLangMatch("finalVideoEmbed.creatorUsername", lang.code)}`,
                        value: `${videoObject.account.username}`,
                        inline: true
                    },
                    {
                        name: `${getLangMatch("finalVideoEmbed.creatorName", lang.code)}`,
                        value: `${videoObject.account.name}`,
                        inline: true
                    },
                    {
                        name: "\u200b",
                        value: "\u200b",
                        inline: true
                    }
                ])
                .addFields([{
                        name: `${getLangMatch("finalVideoEmbed.videoViews", lang.code)}`,
                        value: `${videoObject.video.stats.views}`,
                        inline: true
                    },
                    {
                        name: `${getLangMatch("finalVideoEmbed.videoLikes", lang.code)}`,
                        value: `${videoObject.video.stats.likes}`,
                        inline: true
                    },
                    {
                        name: `${getLangMatch("finalVideoEmbed.videoComments", lang.code)}`,
                        value: `${videoObject.video.stats.comments}`,
                        inline: true
                    }
                ])
                .addFields([{
                        name: `${getLangMatch("finalVideoEmbed.trackName", lang.code)}`,
                        value: `${videoObject.audio.track}`,
                        inline: true
                    },
                    {
                        name: `${getLangMatch("finalVideoEmbed.trackAlbum", lang.code)}`,
                        value: `${videoObject.audio.album}`,
                        inline: true
                    },
                    {
                        name: `${getLangMatch("finalVideoEmbed.trackArtist", lang.code)}`,
                        value: `${videoObject.audio.artist}`,
                        inline: true
                    }
                ])
                .setFooter({
                    text: `Upload Date: ${videoObject.video.uploadTime.date}${videoObject.video.uploadTime.ordinal} ${videoObject.video.uploadTime.monthName} ${videoObject.video.uploadTime.year} ${videoObject.video.uploadTime.time.hour}:${videoObject.video.uploadTime.time.minutes}`
                })
                .setTimestamp();
            console.log(lcl.green("[Video - Success]"), "Built final embed.");

            if (attachments.length > 0) {
                console.log(lcl.blue("[Video - Info]"), "Sending to discord...");
                await interaction.followUp({
                    "embeds": [videoFinalEmbed],
                    "files": attachments
                })
                console.log(lcl.green("[Video - Success]"), "Sent to discord.");
            }

            // finsih p7 - 7c1947a3-f36a-4026-b997-7a37254c1dc0
            const videoEditEmbedP7 = new EmbedBuilder()
                .setTitle(getLangMatch("videoEditEmbedP7.title", lang.code))
                .setColor(colorHex());
            await interaction.editReply({
                embeds: [videoEditEmbedP7],
                ephemeral: true
            });

            // delete all files
            console.log(lcl.blue("[Video - Info]"), "Deleting all files...");
            await clearDownloads();
            console.log(lcl.green("[Video - Success]"), "Deleted all files.");

            // le end
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

            // clear download folder
            await clearDownloads();

            console.log(lcl.red("[Discord - Error]"), err.message);
            return console.log(lcl.red("[Discord - Error]"), err.stack);
        }
    }
}