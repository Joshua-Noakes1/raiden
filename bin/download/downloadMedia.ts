import clc from "cli-color";
import path from 'path';
import { v4 as uuidv4 } from "uuid";
import Downloader from "nodejs-file-downloader";

export async function downloadMedia(url:string, format:string) {
    // generate uuid
    const uuid = uuidv4();
    // set up downloader
    const downloader = new Downloader({
        url: url,
        directory: path.join(__dirname, 'data'),
        onProgress: function(percentage) {
            console.log(`${clc.green(`[${uuid}]`)} ${percentage}%`);
        },
        fileName: `${uuid}.${format}`,
    });
    // try to download
    try {
        await downloader.download();
        console.log(clc.green(`[${uuid}]`), `Downloaded media (.${format})`);
    } catch(error) {
        console.log(clc.red(`[${uuid}]`), "Failed to download video", error);
    }
    return {uuid, location: path.join(__dirname, 'data', `${uuid}.${format}`)};
}