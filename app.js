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
    Collection,
    ActivityType,
    EmbedBuilder
} = require("discord.js");
const {
    readdirSync,
    writeFileSync,
    existsSync
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
    (async () => {
        // get client ID
        const clientId = client.user.id;

        // set status
        await client.user.setPresence({
            activities: [{
                name: `TikTok`,
                type: ActivityType.Watching,
            }],
            status: 'idle'
        });

        // try and clear all existing commands after checking if alreadClear.txt is not present
        if (!existsSync(path.join(__dirname, 'alreadyClear.txt'))) {
            try {
                console.log(lcl.blue("[Discord - Info]"), "Clearing all existing commands, this may take a minute...");
                if (process.env.SERVER != undefined && process.env.SERVER != "") {
                    console.log(lcl.blue("[Discord - Info (Dev)]"), "Using server ID: " + process.env.SERVER);
                    await rest.put(Routes.applicationGuildCommands(clientId, process.env.SERVER), {
                        body: []
                    });
                    await rest.put(Routes.applicationCommands(clientId), {
                        body: []
                    });
                } else {
                    await rest.put(Routes.applicationCommands(clientId), {
                        body: []
                    });
                }

                // write to alreadClear.txt
                writeFileSync(path.join(__dirname, 'alreadyClear.txt'), `true; ${new Date()}`);
                console.log(lcl.green("[Discord - Success]"), "Successfully cleared all commands.");
            } catch (err) {
                console.log(lcl.red("[Discord - Error]"), "Failed to clear commands.");
                console.error(err);
                process.exit(1);
            }
        }

        // attempt to register commands
        try {
            console.log(lcl.blue("[Discord - Info]"), `Started refreshing ${lcl.yellow(commands.length)} application (/) ${commands.length > 1 ? "commands":"command"}.`);
            if (process.env.SERVER != undefined && process.env.SERVER != "") {
                console.log(lcl.blue("[Discord - Info (Dev)]"), "Using server ID: " + process.env.SERVER);
                var data = await rest.put(
                    Routes.applicationGuildCommands(clientId, process.env.SERVER), {
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

        // finish
        console.log(lcl.blue("[Discord - Info]"), `Logged in as "${lcl.yellow(client.user.tag)}"!`);

        // clear downloads folder
        await clearDownload();
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
            console.log(lcl.blue("[Discord - Info]"), `"${lcl.yellow(interaction.user.tag)}" used the "${lcl.yellow(interaction.commandName)}" (/) command${interaction.guildId !== null ? ` in "${lcl.yellow(interaction.guild.name)}"` : ''}.`);
            await command.execute(interaction);
        } catch (err) {
            console.log(lcl.red("[Discord - Error]"), `Failed to execute command: "${interaction.commandName}"`);
            console.error(err);

            // create embed - TODO: Translate
            const interactionErrorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("There was an error while executing this command!")
                .setColor("#ff6961")
                .setTimestamp();
            await interaction.reply({
                // content: 'There was an error while executing this command!',
                embeds: [interactionErrorEmbed],
                ephemeral: true
            });
        }
    } catch (err) {
        console.log(lcl.red("[Discord - Error]"), `Failed to execute command: "${interaction.commandName}"`);
        console.error(err);

        // create embed - TODO: Translate
        const interactionErrorEmbed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("There was an error while executing this command!")
            .setColor("#ff6961")
            .setTimestamp();
        await interaction.reply({
            // content: 'There was an error while executing this command!',
            embeds: [interactionErrorEmbed],
            ephemeral: true
        });
    }
})

client.login(process.env.TOKEN);