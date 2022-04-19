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


        return;
    }
}