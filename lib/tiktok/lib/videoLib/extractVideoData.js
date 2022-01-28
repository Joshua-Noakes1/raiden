const dateTime = require('../../../../bin/dateTime'),
    getThumbnails = require('./videoDataLib/getThumbnails');

async function extractVideoData(video) {
    return {
        meta: {
            author: {
                authorUsername: video.uploader,
                authorName: video.creator,
                authorID: video.uploader_id
            },
            videoID: video.id,
            videoTitle: video.title,
            URL: {
                account: video.uploader_url,
                video: `${video.uploader_url}/video/${video.id}`
            },
            viewCount: video.view_count,
            likeCount: video.like_count,
            commentCount: video.comment_count,
            repostCount: video.repost_count,
            uploadDateTime: await dateTime(Math.floor(video.timestamp * 1000))
        },
        videos: {
            watermarked: { // formats[0] is what the browser gets - has logo
                watermarkedURL: video.formats[0].url,
                watermarkedFormat: video.formats[0].video_ext,
                watermarkedSize: video.formats[0].filesize,
            },
            raw: { // formats[3] is what the TikTok app gets - no logo
                rawURL: video.formats[3].url,
                rawFormat: video.formats[3].video_ext,
                rawSize: video.formats[3].filesize,

            }
        },
        images: {
            imageCover: await getThumbnails(video.thumbnails, 'static'),
            imageDynamic: await getThumbnails(video.thumbnails, 'dynamic'),
        },
        audio: {
            audioTrackname: video.track,
            audioAlbum: video.album,
            audioArtist: video.artist,
        }
    }
}

module.exports = extractVideoData;