const lcl = require('cli-color');
const colorHex = require('../lib/color');
const getTikTok = require('../lib/fetchTikTok');
const downloadMedia = require('../lib/downloadMedia');
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

            var mediaTest = await downloadMedia(tikTokVideo.video.formats[0].url, tikTokVideo.video.formats[0].video_ext);
            console.log(mediaTest);

            console.log(tikTokVideo);

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