import clc from "cli-color";
import fs from "fs";
import { YTDLP } from "../bin/yt-dl/ytdlp-core";
import { downloadMedia } from "../bin/download/downloadMedia";
import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "media",
  description: "send all tiktoks",
  testOnly: true,

  callback: async ({ user, message, args }) => {
    // check to see if the user has given a tiktok url
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle("Missing username")
        .setColor("#ff0050")
        .setDescription("Please provide a username");
      return embed;
    }
    // giving feedback to the user
    message.channel.send(`Downloading videos from **${args[0]}**`);

    // get YTDLP data
    const ytdlp = await YTDLP(`https://tiktok.com/${args[0]}`);
    // user has no videos or doesnt exist
    if (!ytdlp.success) {
      console.log(ytdlp.error);
      const embed = new MessageEmbed()
        .setTitle("YTDLP Failed")
        .setColor("#ff0050")
        .setDescription(
          `This could mean **${args[0]}** doesn't have any videos or they don't exist`
        );
      return embed;
    }

    // get the videos
    const videos: any = ytdlp.result;

    if (videos.entries.length > 0) {
      var loopLength = args[1] == undefined ? videos.entries.length : args[1];
      for (var i = 0; i < loopLength; i++) {
        var video = videos.entries[i];
        // download video and thumbnail
        const thumbnail: any = await downloadMedia(
          video.thumbnails[3].url,
          "jpeg"
        );
        const videoFile: any = await downloadMedia(video.formats[3].url, "mp4");
        const videoFile_watermark: any = await downloadMedia(
          video.formats[0].url,
          "mp4"
        );
        // create embed
        const embed = new MessageEmbed()
          .setTitle(`Video ${i + 1}/${loopLength} (ID: ${video.id})`)
          .setDescription(video.description)
          .setColor("#ff0050")
          .addFields(
            { name: "Username", value: video.uploader, inline: true },
            { name: "Name", value: video.creator, inline: true },
            { name: "\u200B", value: "\u200B", inline: true }
          )
          .addFields(
            { name: "Views", value: `${video.view_count}`, inline: true },
            { name: "Likes", value: `${video.like_count}`, inline: true },
            { name: "Comments", value: `${video.comment_count}`, inline: true }
          )
          .setURL(`https://tiktok.com/@${video.uploader}/video/${video.id}`);

        // send embed, video and thumbnail
        await message.channel.send({
          embeds: [embed],
          files: [
            thumbnail.location,
            videoFile.location,
            videoFile_watermark.location,
          ],
        });
        // delete files
        await fs.unlinkSync(thumbnail.location);
        await fs.unlinkSync(videoFile.location);
        await fs.unlinkSync(videoFile_watermark.location);
      }
      // create final embed
      console.log(clc.green("[Success]"), `Downloaded user ${args[0]}`);
      const embed = new MessageEmbed()
        .setTitle("Download Complete")
        .setColor("#ff0050")
        .setDescription(`Downloaded **${loopLength}** videos`);
      return embed;
    } else {
      const embed = new MessageEmbed()
        .setTitle("No videos found")
        .setColor("#ff0050")
        .setDescription(
          `This could mean **${args[0]}** doesn't have any videos or they don't exist`
        );
      return embed;
    }
  },
} as ICommand;
