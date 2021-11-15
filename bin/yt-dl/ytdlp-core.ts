import clc from "cli-color";
import path from "path";
import { downloadYTDLP } from "./ytdlp-download";
import { create as createYTDL } from "youtube-dl-exec";
const ytdlp = createYTDL(
  path.join(
    __dirname,
    "bin",
    process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
  )
);

export async function YTDLP(url: string) {
  // check for any YT-DLP updates before downloading
  await downloadYTDLP();
  // try and get info of url
  try {
    const result = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    });
    return { success: true, result };
  } catch (error) {
    console.log(clc.redBright(["Error"]), error);
    return { success: false, error };
  }
}
