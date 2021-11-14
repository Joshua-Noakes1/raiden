import path from "path";
import { downloadVideo } from "../bin/download/downloadVideo";
import { YTDLP } from "../bin/ytdl/ytdl";
import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "testing",
  description: "Sends an Embed",

  //   slash: false,
  testOnly: true,

  callback: async ({ message, args }) => {
    // check if the user has given a url
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle("Missing user")
        .setDescription("Please provide a user");
      return embed;
    }
    // start download
    message.channel.send(`Downloading user **${args[0]}**`);
    // check with ytdl to see if user exists
    let ytdl: any;
    try {
      ytdl = await YTDLP(`https://tiktok.com/${args[0]}`);
    } catch (error) {
      console.log(error);
    }
    console.log(ytdl);
    if (ytdl.success) {
      return "Sussy";
    } else {
      const embed2 = new MessageEmbed().setTitle("Failed to get user info");
      return embed2;
    }
  },
} as ICommand;
