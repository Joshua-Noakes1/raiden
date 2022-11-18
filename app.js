require("dotenv").config();
const lcl = require("cli-color");
const path = require("path");
const clearDownload = require('./lib/clearDownloads');
const {
    REST
} = require('@discordjs/rest');
const {
    Client,
    GatewayIntentBits,
    Routes,
    Collection
} = require("discord.js");
const {
    readdirSync
} = require('fs');

const client = new Client({
    disableEveryone: true,
    intents: [GatewayIntentBits.Guilds],
});

// get base for commands
const commands = [];
const commandFiles = readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const rest = new REST({
    version: '10'
}).setToken(process.env.TOKEN);

client.once("ready", (client) => {
    // get client ID
    const clientId = client.user.id;

    (async () => {
        // attempt to register commands
        try {
            console.log(lcl.blue("[Discord - Info]"), `Started refreshing ${lcl.yellow(commands.length)} application (/) ${commands.length > 1 ? "commands":"command"}.`);
            if (process.env.server != undefined && process.env.server != "") {
                console.log(lcl.blue("[Discord - Info (Dev)]"), "Using server ID: " + process.env.server);
                var data = await rest.put(
                    Routes.applicationGuildCommands(clientId, process.env.server), {
                        body: commands
                    },
                );
            } else {
                var data = await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: commands
                    },
                );
            }
            console.log(lcl.green("[Discord - Success]"), `Successfully reloaded ${lcl.yellow(data.length)} application (/) ${commands.length > 1 ? "commands":"command"}.`);
        } catch (err) {
            console.log(lcl.red("[Discord - Error]"), "Failed to reload application (/) commands.");
            console.error(err);
            process.exit(1);
        }

        // clear downloads folder
        await clearDownload();

        // finish
        console.log(lcl.blue("[Discord - Info]"), `Logged in as "${lcl.yellow(client.user.tag)}"!`);
    })();
});

client.on('interactionCreate', async interaction => {
    // try find command
    try {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        // try executing command
        try {
            console.log(lcl.blue("[Discord - Info]"), `"${lcl.yellow(interaction.user.tag)}" used the "${lcl.yellow(interaction.commandName)}" (/) command in "${lcl.yellow(interaction.guild.name)}".`);
            await command.execute(interaction);
        } catch (err) {
            console.log(lcl.red("[Discord - Error]"), `Failed to execute command: "${interaction.commandName}"`);
            console.error(err);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    } catch (err) {
        console.log(lcl.red("[Discord - Error]"), `Failed to execute command: "${interaction.commandName}"`);
        console.error(err);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
})

client.login(process.env.TOKEN);