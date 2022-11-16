const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const {
    Linguini, TypeMappers
} = require('linguini');
const path = require('path');
let lang = new Linguini(path.join(__dirname, '..', 'langs'), 'lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setNameLocalizations({ // This comes from Google Translate, so it may not be accurate. https://translate.google.com/?sl=en&tl=es&text=ping&op=translate&hl=en
            "es-ES": 'silbido',
        })
        .setDescription('See Raiden\'s latency.')
        .setDescriptionLocalizations({
            "es-ES": 'Ver la latencia de Raiden.',
        }),

    async execute(interaction) {
        // random array of hex pastels
        var colors = ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];
        var color = colors[Math.floor(Math.random() * colors.length)];

        console.log(lang.get('ping.test', interaction.locale, TypeMappers.String)); // Test string

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