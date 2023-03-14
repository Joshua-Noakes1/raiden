const lcl = require('cli-color');
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('video')
        .setDescription('Download a post from a supported site')
        .addStringOption(option => option.setName('url').setDescription('The URL of the post to download').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        const url = interaction.options.getString('url').toString();

        // check if URL is valid and not empty
        var urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
        if (!urlRegex.test(url) || url == "" || url == undefined) {
            console.log(lcl.red("[Video - Error]"), "Invalid URL provided.");
            const failedURLError = new EmbedBuilder()
                .setTitle("Please provide a valid URL")
                .setDescription("The URL you provided is not valid. Please make sure you are providing a valid URL.")
                .setColor("#ff6961")
                .setTimestamp();
            await interaction.editReply({
                embeds: [failedURLError]
            });
            return;
        }

        // check if URL is supported
        switch (url) {
            default:
                console.log(lcl.red("[Video - Error]"), "Unsupported URL provided.");
                const unsupportedURLError = new EmbedBuilder()
                    .setTitle("Unsupported site")
                    .setDescription("Raiden currently does not support this site, If the site has support in [yt-dlp](https://github.com/yt-dlp/yt-dlp) please open an [issue](https://github.com/Joshua-Noakes1/raiden/issues)")
                    .setColor("#ff6961")
                    .setTimestamp();
                await interaction.editReply({
                    embeds: [unsupportedURLError]
                });
                return;

        }
    }
}