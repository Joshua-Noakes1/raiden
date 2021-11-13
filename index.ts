// setup for the app
import DiscordJS, { Intents } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

// create discord client
const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {   
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

client.login(process.env.TOKEN);
