const lcl = require('cli-color');

async function getThumbnail(videos, videoTypes) {

    let videoURL = '';

    await asyncForEach(videos, async (video, index, array) => {
        // return image if type matches
        switch (videoTypes) {
            case 'watermark':
                if ((video.format_note == 'Download video, watermarked') && videoURL == '') {
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

    if (videoTypes == 'watermark' && videoURL == '') {
        // bodge for fix where we only get playback video returned
        console.log(lcl.yellow("[TikTok - Warn]"), "No watermarked video found... only using un-watermarked video.");
        videos.push({
            url: 'http://example.com',
            video_ext: 'mp4',
            filesize: 0
        });
        videoURL = videos.length - 1;
    }
    return videoURL;
}
// fix callback hell 
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = getThumbnail;