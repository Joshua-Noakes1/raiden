const {
    execSync
} = require('child_process');

function webpToGif(webpPath, gifPath) {
    try {
        // try and convert webp to gif
        execSync(`${process.platform == 'win32' ? 'magick' : 'convert'} ${webpPath} ${gifPath}`);
        return {
            success: true
        }
    } catch(err) {
        // catch errors
        return {
            success: false
        }
    }
}

module.exports = webpToGif;