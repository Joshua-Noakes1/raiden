import clc from "cli-color";
import path from "path";
import { loadJSON, writeJSON } from "../loadWrite";
import { existsSync } from "fs";
import Downloader from "nodejs-file-downloader";
import fetch from "node-fetch";

export async function downloadYTDLP() {
  // load ytdl config
  if (existsSync(path.join(__dirname, "bin", "ytdl-version.json"))) {
    var ytdlVersion: any = await loadJSON(
      path.join(__dirname, "bin", "ytdl-version.json"),
      true
    );
  } else {
    await writeJSON(
      path.join(__dirname, "bin", "ytdl-version.json"),
      {
        version: "0",
      },
      true
    );
    var ytdlVersion: any = await loadJSON(
      path.join(__dirname, "bin", "ytdl-version.json"),
      true
    );
  }

  // check github for latest version
  var releases: any = await fetch(
    "https://api.github.com/repos/yt-dlp/yt-dlp/releases"
  );
  releases = await releases.json();

  // check if latest version is newer than current version if not download
  if (releases[0].tag_name !== ytdlVersion.version) {
    console.log(clc.yellow("Downloading new version of ytdl..."));
    const downloader = new Downloader({
      url:
        process.platform === "win32"
          ? `https://github.com/yt-dlp/yt-dlp/releases/download/${releases[0].tag_name}/yt-dlp.exe`
          : `https://github.com/yt-dlp/yt-dlp/releases/download/${releases[0].tag_name}/yt-dlp`,
      directory: path.join(__dirname, "bin"),
      onProgress: function (percentage) {
        console.log("% ", percentage);
      },
      fileName: process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp",
      cloneFiles: false,
    });

    // try and download
    try {
      await downloader.download();
    } catch (error) {
      console.log(clc.red("[Error]"), "Failed to download", error);
      process.exit(1);
    }

    // save ytdl version
    console.log(clc.green("[Success]"), "Downloaded new version of ytdl.");
    await writeJSON(
      path.join(__dirname, "bin", "ytdl-version.json"),
      {
        version: releases[0].tag_name,
      },
      true
    );
    process.exit(0);
  } else {
    console.log(clc.green("[Success]"), "No new version of ytdlp available.");
  }
}