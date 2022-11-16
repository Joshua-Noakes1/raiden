const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('See Raiden\'s latency.'),
    async execute(interaction) {
        // random array of hex pastels
        var colors = ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];
        var color = colors[Math.floor(Math.random() * colors.length)];

        // build embed
        const embed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .addFields({
                name: "Discord API Latency",
                value: `${interaction.client.ws.ping}ms`,
                inline: true
            }, {
                name: "Message Latency",
                value: `${Date.now() - interaction.createdTimestamp}ms`,
                inline: true
            })
            .setColor(color)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}