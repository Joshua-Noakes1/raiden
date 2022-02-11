const {
    unlinkSync
} = require('fs');

async function delVideos(attach) {

    // delete media files
    await unlinkSync(attach.videoThumb.path);
    await unlinkSync(attach.videoDynamicThumb.path);
    await unlinkSync(attach.videoDynamicWebP.path);
    await unlinkSync(attach.videoWatermarked.path);
    await unlinkSync(attach.videoRaw.path);

}

module.exports = delVideos;