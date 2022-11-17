const lcl = require('cli-color');
const colorHex = require('../lib/color');
var youtubedl = require('youtube-dl-exec');
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
            if (url.cock.match(/^(?:https?:\/\/)?(?:vm\.)?(?:www\.)?tiktok\.com/gm) == null || url == null || url == undefined || url == "") {
                const errorEmbed = new EmbedBuilder() // a68765ba-b7ad-43bb-9c3a-748e7bafba7e
                    .setTitle(getLangMatch("videoFailURLInvalid.title", lang.code))
                    .setDescription(getLangMatch("videoFailURLInvalid.description", lang.code))
                    .setColor("#FF0000")
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [errorEmbed]
                });
                return;
            }


            // re-import ytdl so we check for updates
            console.log(lcl.blue("[YTDL - Info]"), "Checking for updates...");
            youtubedl = require('youtube-dl-exec')

            // create initial embed - 327fe4d3-0986-435e-8d86-59785d86cde6
            const videoInitialEmbedP1 = new EmbedBuilder()
                .setTitle(getLangMatch("videoInitialEmbedP1.title", lang.code));
            await interaction.editReply({
                embeds: [videoInitialEmbedP1],
                ephemeral: true
            });

            // var tiktok = await youtubedl('https://www.youtube.com/watch?v=6xKWiCMKKJg', {
            //     dumpSingleJson: true,
            //     noCheckCertificates: true,
            //     noWarnings: true,
            //     preferFreeFormats: true,
            //     addHeader: [
            //       'referer:youtube.com',
            //       'user-agent:googlebot'
            //     ]

            //   })

            // console.log(tiktok);
            // interaction.editReply("Done!");
        } catch (err) {
            // something went wrong - 5d36cc82-cd48-4a8b-b859-5ddffb7a63f2
            const somethingWentWrongEmbed = new EmbedBuilder()
                .setTitle(getLangMatch("videoSomethingWentWrong.title", lang.code))
                .setDescription(getLangMatch("videoSomethingWentWrong.description", lang.code))
                .setColor("#FF0000")
                .setTimestamp();
            await interaction.editReply({
                embeds: [somethingWentWrongEmbed]
            });

            console.log(lcl.red("[Discord - Error]"), err.message);
            return console.log(lcl.red("[Discord - Error]"), err.stack);
        }
    }
}