require('dotenv').config();
const lcl = require('cli-color'),
    path = require('path'),
    WOKCommands = require('wokcommands'),
    {
        Client,
        Intents
    } = require('discord.js');

// intents for client
const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
    restRequestTimeout: 30 * 1000 // 30 seconds
});

// client is on and ready
client.on('ready', async (client) => {
    // log we are in
    console.log(lcl.blue("[Discord - Info]"), "Logged in as", lcl.green(client.user.tag));

    // set status
    client.user.setPresence({
        status: "dnd",
        activities: [{
            name: "TikTok",
            type: "WATCHING"
        }]
    });

    // command handler
    await new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        showWarns: false, // not using mongodb so to stop warnings
        ignoreBots: false,
        testServers: ['909103932406640660'],
        botOwners: ['412876072540045312'],
        disabledDefaultCommands: [
            'help',
            'command',
            'language',
            'prefix',
            'requiredrole',
            'channelonly'
        ],
    }).setDefaultPrefix('?');
});

// log into discord
client.login(process.env.TOKEN);