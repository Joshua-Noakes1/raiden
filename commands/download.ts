import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "media",
  description: "send all tiktoks",

  //   slash: false,
  testOnly: true,

  callback: async ({ message, args }) => {
      return "Lorel Ipsum"
  },
} as ICommand;
