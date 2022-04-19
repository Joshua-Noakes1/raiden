require('dotenv').config();
const lcl = require('cli-color'),
    urlParse = require('url-parse'),
    langs = require('../services/lang/loadLangs')('TikTok Video'),
    {
        MessageEmbed,
        Constants
    } = require('discord.js');

module.exports = {
    category: langs.VIDEO_CATEGORY,
    description: langs.VIDEO_DESCRIPTION,

    slash: true,
    testOnly: process.env.DEV_MODE == "true" ? true : false, // Only register a slash command for the testing guilds

    options: [{
        name: langs.VIDEO_URL_NAME,
        description: langs.VIDEO_URL_DESCRIPTION,
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
    }],

    callback: async ({
        interaction
    }) => {
        await interaction.deferReply({
            ephemeral: true
        });

        // Parse URL
        const discordURL = await interaction.options.getString(langs.VIDEO_URL_NAME);
        const parsedURL = new urlParse(discordURL);

        // Check if TikTok url is valid
        if (parsedURL.hostname.match(/^(?:https?:\/\/)?(?:vm\.)?(?:www\.)?tiktok\.com/gm) == null) { // vm.tiktok.com - Mobile Share URL, www.tiktok.com - Desktop Share URL
            console.log(lcl.red(langs.CONSOLE_TIKTOK_ERROR), langs.CONSOLE_TIKTOK_ERROR_INVALID_URL);
            const ttInvalidURLEmbed = new MessageEmbed()
                .setTitle(langs.EMBED_TIKTOK_INVALID_URL_TITLE)
                .setDescription(langs.EMBED_TIKTOK_INVALID_URL_DESCRIPTION)
                .setColor("DARK_RED")
                .setTimestamp();
            // return error embed
            await interaction.editReply({
                embeds: [ttInvalidURLEmbed]
            });
        }

        return;
    }
}