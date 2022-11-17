const colorHex = require('../lib/color');
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const {
    mapLang,
    getLangMatch
} = require('../langs/getLangs');

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
        // get language and color
        var lang = mapLang(interaction.locale);

        // build embed - b1221fb2-4a78-497a-8db5-8956d3f3b8b9
        const pingEmbed = new EmbedBuilder()
            .setTitle(getLangMatch("pingEmbed.title", lang.code))
            .addFields({
                name: getLangMatch("pingEmbed.discordAPILatency", lang.code),
                value: `${interaction.client.ws.ping}ms`,
                inline: true
            }, {
                name: getLangMatch("pingEmbed.messageLatency", lang.code),
                value: `${Date.now() - interaction.createdTimestamp}ms`,
                inline: true
            }, {
                name: getLangMatch("pingEmbed.currentLanguage", lang.code),
                value: `${lang.nativeLang} (${lang.lang})`,
                inline: true
            })
            .setThumbnail(interaction.client.user.avatarURL())
            .setColor(colorHex())
            .setTimestamp();

        await interaction.reply({
            embeds: [pingEmbed],
            ephemeral: true
        });
    }
}