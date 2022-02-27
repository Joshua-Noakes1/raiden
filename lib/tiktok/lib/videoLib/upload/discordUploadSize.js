const lcl = require('cli-color'),
    {
        statSync
    } = require('fs');

async function discordUploadSize(path) {
    try {
        var fileSize = await statSync(path);
        if (fileSize.size < 8000000) {
            return {
                size: fileSize.size,
                success: true
            }
        } else {
            console.log(lcl.red('[Discord - Error]'), 'File is too big to upload to Discord');
            return {
                size: fileSize.size,
                success: false
            }
        }
    } catch (error) {
        console.log(lcl.red('[Discord - Error]'), 'Error while trying to get file size:');
        if (process.env.dev == "true") console.log(error);
        return {
            size: 8000001, // set above 8MB so an upload to discord will fail
            success: false
        }
    }
}

module.exports = discordUploadSize;