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
        console.log(lcl.red("[WebPToGIF - Error]"), "Failed to convert webp to gif, falling back to WebP image will be missing in discord");
        return {
            success: false
        }
    }
}

module.exports = webpToGIF;