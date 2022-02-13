const lcl = require('cli-color'),
    {
        execSync
    } = require('child_process');

async function webpToGIF(webpPath, webpUUID, gifPath) {
    console.log(lcl.blue("[WebPToGIF - Info]"), `Converting (${webpUUID}.webp)`);

    try {
        await execSync(`${process.platform == 'win32' ? 'magick' : 'convert'} ${webpPath} ${gifPath}`);
        console.log(lcl.green("[WebPToGIF - Success]"), `Converted webp (${webpUUID}.webp) to gif`);
        return {
            path: gifPath,
            success: true
        }
    } catch (err) {
        console.log(lcl.red("[WebPToGIF - Error]"), "Failed to convert WebP to GIF, falling back to static thumbnail");
        return {
            success: false
        }
    }
}

module.exports = webpToGIF;