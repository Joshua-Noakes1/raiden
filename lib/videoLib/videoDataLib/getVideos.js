async function getThumbnail(videos, videoTypes) {

    let videoURL = '';

    await asyncForEach(videos, async (video, index, array) => {
        // return image if type matches
        switch (videoTypes) {
            case 'watermark':
                if (video.format_note == 'Download video, watermarked' && videoURL == '') {
                    videoURL = index;
                }
                break;
            case 'clean':
                if (video.format_note == 'Direct video (API)' && videoURL == '') {
                    videoURL = index;
                }
                break;
            default:
                // asuka bark shouldnt be seen but just incase 
                videoURL = 0;
                break;
        }
    });

    return videoURL;
}
// fix callback hell 
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = getThumbnail;