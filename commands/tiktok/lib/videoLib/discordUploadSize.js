const lcl = require('cli-color'),
    {
        statSync
    } = require('fs');

async function discordUploadSize(path) {
    try {
        var fileSize = await statSync(path);
        if (fileSize.size > 8000000) {
            return {
                success: true
            }
        } else {
            console.log(lcl.red('[Discord - Error]'), 'File is too big to upload to Discord');
            return {
                success: false
            }
        }
    } catch (error) {
        console.log(lcl.red('[Discord - Error]'), 'Error while trying to get file size:', error);
        return {
            success: false
        }
    }
}

module.exports = discordUploadSize;