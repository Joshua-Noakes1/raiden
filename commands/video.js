const videoHandler = require('../lib/videoHandler'),
    {
        Constants
    } = require('discord.js');

module.exports = {
    category: 'Media',
    description: 'Replies with an individual video or account from TikTok',

    slash: true,
    testOnly: process.env.dev == "true" ? true : false, // only test is .env dev is true

    options: [{
        name: 'url',
        description: 'Video or Account URL from TikTok eg: vm.tiktok.com/ZM8K5XLfV', // example 
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
    }],

    callback: async ({
        interaction
    }) => {
        // ship off to videoHandler.js so WOK doesnt list every lib as a command in client
        await videoHandler(interaction);
    }
}