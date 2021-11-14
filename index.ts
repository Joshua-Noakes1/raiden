// setup for the app
import DiscordJS, { Intents } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// create discord client
const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.on("ready", async (client) => {
  // WOKCommands setup - https://docs.wornoffkeys.com/setup-and-options-object
  await new WOKCommands(client, {
    commandDir: path.join(__dirname, "commands"),
    typeScript: true,
    ephemeral: true,
    testServers: ["909103932406640660"],
    botOwners: ["412876072540045312"],
  });
  client.user.setPresence({status: "dnd", activities: [{name: "Watching TikTok"}]});
});

// client.on("messageCreate", (message) => {
//   // guild slash commands - Instant (909103932406640660)
//   const guildID = "909103932406640660";
//   const guild = client.guilds.cache.get(guildID);
//   let commands;

//   if (guild) {
//     commands = guild.commands;
//   } else {
//     commands = client.application?.commands;
//   }

//   commands?.create({
//     name: "ping",
//     description: "pong",
//   });

//   commands?.create({
//     name: "add",
//     description: "adds two numbers",
//     options: [
//       {
//         name: "num1",
//         description: "first number",
//         required: true,
//         type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
//       },
//       {
//         name: "num2",
//         description: "second number",
//         required: true,
//         type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
//       },
//     ],
//   });
// });

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) return;
//   const { commandName, options } = interaction;

//   if (commandName === "ping") {
//     interaction.reply({
//       content: "pong",
//       ephemeral: true,
//     });
//   } else if (commandName === "add") {
//     const num1 = options.getNumber("num1")!;
//     const num2 = options.getNumber("num2")!;
//     const sum = num1 + num2;

//     interaction.reply({
//       content: `${num1} + ${num2} = ${sum}`,
//       ephemeral: true,
//     });
//   }
// });

client.login(process.env.TOKEN);
