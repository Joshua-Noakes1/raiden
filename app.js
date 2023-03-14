require("dotenv").config();
const lcl = require("cli-color");
const path = require("path");
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
    readdirSync
} = require('fs');

const client = new Client({
    disableEveryone: true,
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

// get base for commands
const commands = [];
try {
    const commandFiles = readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.command.js'));
    client.commands = new Collection();

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }
} catch (err) {
    console.log(lcl.red("[Startup - Error]"), "Failed to load commands.", lcl.yellow(err.toString().split("Error: ")[1]));
}

const rest = new REST({
    version: '10'
}).setToken(process.env.TOKEN);

client.once("ready", (client) => {
    (async () => {

        // get client ID
        const clientId = client.user.id;

        // clear commands if not already clear and user wants to clear
        try {
            if (process.env.NOT_CLEAR_COMMANDS !== "true" || commands.length <= 0) {
                // get all commands
                var applicationCommands = [];
                if (process.env.SERVER != undefined && process.env.SERVER != "") {
                    await rest.get(Routes.applicationGuildCommands(clientId, process.env.SERVER)).then((data) => {
                        applicationCommands.push(data);
                    });
                }
                await rest.get(Routes.applicationCommands(clientId)).then((data) => {
                    applicationCommands.push(data);
                });
                // remove duplicates
                applicationCommands = applicationCommands.flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

                // clear commands
                if (applicationCommands != undefined && applicationCommands.length > 0) {
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
                    console.log(lcl.green("[Discord - Success]"), "Successfully cleared all commands.");
                }
            }
        } catch (err) {
            console.log(lcl.red("[Discord - Error]"), "Failed to clear commands.");
            console.error(err);
            process.exit(1);
        }


        if (commands.length > 0) {
            // attempt to register commands
            try {
                console.log(lcl.blue("[Discord - Info]"), `Started refreshing ${lcl.yellow(commands.length)} application (/) ${commands.length > 1 ? "commands" : "command"}.`);
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
                console.log(lcl.green("[Discord - Success]"), `Successfully reloaded ${lcl.yellow(data.length)} application (/) ${commands.length > 1 ? "commands" : "command"}.`);
            } catch (err) {
                console.log(lcl.red("[Discord - Error]"), "Failed to reload application (/) commands.");
                console.error(err);
                process.exit(1);
            }
        }

        // finish and set status
        await client.user.setPresence({
            activities: [{
                name: `Breaking Bad`,
                type: ActivityType.Watching,
            }],
            status: 'idle'
        });
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