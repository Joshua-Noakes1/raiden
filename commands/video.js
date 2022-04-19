require('dotenv').config();
const lcl = require('cli-color'),
    urlParse = require('url-parse'),
    {
        MessageEmbed,
        Constants
    } = require('discord.js');

module.exports = {
    category: 'TikTok',
    description: 'Downloads a single video or all the videos from an account on TikTok',

    slash: true,
    testOnly: process.env.DEV_MODE == "true" ? true : false, // Only register a slash command for the testing guilds

    options: [{
        name: 'url',
        description: 'The URL from a TikTok Video or Account',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
    }],

    callback: async ({
        interaction
    }) => {

        return;
    }
}