const dateTime = require('../../../bin/dateTime');

async function getVideoData(tiktokVideoExec) {
    return {
        video: {
            meta: {
                author: {
                    username: tiktokVideoExec.videoResult.uploader,
                    name: tiktokVideoExec.videoResult.creator,
                    id: tiktokVideoExec.videoResult.uploader_id
                },
                videoID: tiktokVideoExec.videoResult.id,
                title: tiktokVideoExec.videoResult.title,
                accountUUID: tiktokVideoExec.videoResult.uploader_url,
                url: `${tiktokVideoExec.videoResult.uploader_url}/video/${tiktokVideoExec.videoResult.id}`,
                viewCount: tiktokVideoExec.videoResult.view_count,
                likeCount: tiktokVideoExec.videoResult.like_count,
                commentCount: tiktokVideoExec.videoResult.comment_count,
                repostCount: tiktokVideoExec.videoResult.repost_count,
                uploadDate: await dateTime(Math.floor(tiktokVideoExec.videoResult.timestamp * 1000))
            },
            video: {
                watermarked: {
                    url: tiktokVideoExec.videoResult.formats[0].url,
                    ext: tiktokVideoExec.videoResult.formats[0].video_ext,
                    size: tiktokVideoExec.videoResult.formats[0].filesize,
                },
                raw: {
                    url: tiktokVideoExec.videoResult.formats[3].url,
                    ext: tiktokVideoExec.videoResult.formats[3].video_ext,
                    size: tiktokVideoExec.videoResult.formats[3].filesize,

                }
            },
            images: {
                cover: tiktokVideoExec.videoResult.thumbnails[0].url,
                dynamic: tiktokVideoExec.videoResult.thumbnails[2].url,
            },
            audio: {
                trackname: tiktokVideoExec.videoResult.track,
                album: tiktokVideoExec.videoResult.album,
                artist: tiktokVideoExec.videoResult.artist,
            }
        }
    }
}

module.exports = getVideoData;