const lcl = require('cli-color'),
    urlParse = require('url-parse'),
    fetch = require('node-fetch'),
    {
        MessageEmbed
    } = require('discord.js');

async function getURL(interaction) {
    // get url
    let dcordURL = urlParse(interaction.options.getString('url'));

    // Check if URL is valid
    if (dcordURL.hostname.match(/^(?:https?:\/\/)?(?:vm\.)?(?:www\.)?tiktok\.com/gm) == null) { // vm.tiktok.com - Mobile Share URL, www.tiktok.com - Desktop Share URL
        console.log(lcl.red("[TikTok - Error]"), "Invalid URL");
        const videoURLErrorEmbed = new MessageEmbed()
            .setTitle("Invalid TikTok URL")
            .setDescription("That wasn't a valid TikTok URL, Please try again...")
            .setColor("#ff0000")
            .setTimestamp();
        // return error embed
        await interaction.editReply({
            embeds: [videoURLErrorEmbed]
        });
        return {
            success: false
        };
    }

    // thers an issue in ytdlp with mobile tiktok urls so doing the head lookup for the url 
    if (dcordURL.host.toString().includes('vm')) {
        dcordURL = await fetch(dcordURL, {
            method: 'HEAD',
            redirect: 'manual'
        });
        dcordURL = await dcordURL.headers.get('Location');
    }

    // return url
    return {
        success: true,
        url: dcordURL.host.toString().includes('vm') ? dcordURL : `${dcordURL.protocol}//${dcordURL.hostname}${dcordURL.pathname}`.replace(/(\r\n|\n|\r)/gm, "").trim()
    };
}
module.exports = getURL;