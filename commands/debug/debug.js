const {
    readJSON
} = require('../../bin/readWrite'),
    path = require('path'), {
        MessageEmbed
    } = require('discord.js');

module.exports = {
    category: 'Testing',
    description: 'Replies with pong', // Required for slash commands

    slash: true, // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds

    callback: async ({
        interaction
    }) => {
        const dockerDebug = await readJSON(path.join(__dirname, 'gha', 'docker.json'));

        if (dockerDebug.success != true) {
            const dockerErrorEmbed = new MessageEmbed()
                .setTitle("Docker Debug Error")
                .setDescription("Failed to fetch docker debug data, Please try again...")
                .setColor("#ff0000")
                .setTimestamp();
            await interaction.reply({
                embeds: [dockerErrorEmbed],
                ephemeral: true
            });
            return;
        }

        const debugEmbed = new MessageEmbed()
            .setTitle("Docker Debug")
            .setColor('ORANGE')
            .addFields([{
                name: "Github Workflow",
                value: dockerDebug.name,
                inline: true
            }, {
                name: "Github Run ID",
                value: dockerDebug.id,
                inline: true
            }, {
                name: "Github Job",
                value: dockerDebug.job,
                inline: true
            }])
            .addFields([{
                name: "Github Actor",
                value: dockerDebug.actor,
                inline: true
            }, {
                name: "Github Repository",
                value: dockerDebug.repository,
                inline: true
            }, {
                name: "Github SHA",
                value: dockerDebug.sha,
                inline: true
            }])
            .addFields([{
                name: "Runner Name",
                value: dockerDebug.runnerName,
                inline: true
            }, {
                name: "Runner OS",
                value: dockerDebug.runnerOS,
                inline: true
            }, {
                name: "Runner Arch",
                value: dockerDebug.runnerArch,
                inline: true
            }])
            .setTimestamp();

        // send embed
        await interaction.reply({
            embeds: [debugEmbed],
            ephemeral: true
        });
    },
}