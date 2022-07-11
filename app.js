require('dotenv').config();
const WOKCommands = require('wokcommands');
const path = require('path');
const lcl = require('cli-color');
const {
    Client,
    Intents
} = require('discord.js');

// load intents
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
    // restRequestTimeout: 30000 // 30 seconds, could even put this to 1 minute
});

// client login
client.on('ready', async (client) => {
    // console log we are in
    console.log(lcl.blue("[Discord - Info]"), "Logged in as", `"${lcl.yellow(`${client.user.tag}`)}"`);

    // set bot status
    client.user.setPresence({
        // status: "dnd",
        activities: [{
            name: "TikTok",
            type: "WATCHING"
        }]
    });

    // command handler
    await new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        showWarns: false, // not using mongodb so to stop warnings
        ignoreBots: true,
        testServers: ['909103932406640660', '793215810805825577'],
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

// login discord
client.login(process.env.TOKEN);