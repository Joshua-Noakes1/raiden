const lcl = require('cli-color'),
    {
        spawn
    } = require('child_process');

async function webpToGIF(webpPath, gifPath) {
    try {
        await spawn('magick', [webpPath, gifPath]);
        return {
            success: true
        }
    } catch (err) {
        console.log(lcl.red("[WebpToGIF - Error]"), "Failed to convert webp to gif", err);
        return {
            success: false
        }
    }
}

module.exports = webpToGIF;