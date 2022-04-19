const lcl = require('cli-color'),
    discordUploadSize = require('./discordUploadSize');

async function checkUploadSize(attachments) {
    console.log(lcl.blue("[Discord - Info]"), "Checking attachment sizes...");

    // check attachment sizes
    var attachmentsTooBig = false;
    var attachmentSizeFull = {
        size: 0,
        videos: []
    };

    await asyncForEach(attachments, async (attachment, index, array) => {
        const attachmentSize = await discordUploadSize(attachment.attachment);
        attachmentSizeFull.size = attachmentSizeFull.size + attachmentSize.size;
        attachmentSizeFull.videos.push({
            size: attachmentSize.size,
            name: attachment.name
        });
    });

    // if total size is bigger then 8MB then remove watermarked video if not return false and refuse to upload
    if (attachmentSizeFull.size > 8000000) {
        console.log(lcl.yellow("[Discord - Warn]"), "File is too big to upload to Discord... Trying to remove watermarked video...");
        attachments.splice(2, 1); // watermarked video
        attachmentSizeFull.size = attachmentSizeFull.size - attachmentSizeFull.videos[2].size;

        // check if size is still bigger then 8MB
        if (attachmentSizeFull.size > 8000000) {
            console.log(lcl.red("[Discord - Error]"), "File is still too big to upload to Discord... Please try again with a smaller file.");
            return {
                success: false
            };
        } else {
            attachmentsTooBig = true;
            return {
                success: true,
                attachments,
                attachmentsTooBig
            }
        }
    }

    return {
        success: true,
        attachments,
        attachmentsTooBig
    }
}

// fix callback hell 
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = checkUploadSize;