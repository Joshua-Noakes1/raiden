const dateTime = require('../../../../bin/dateTime'),
    getThumbnails = require('./videoDataLib/getThumbnails'),
    getVideos = require('./videoDataLib/getVideos');

async function extractVideoData(video) {
    // get video indexes
    let videoIndexes = {
        watermark: await getVideos(video.formats, 'watermark'),
        clean: await getVideos(video.formats, 'clean'),
    }

    return {
        meta: {
            author: {
                authorUsername: video.uploader,
                authorName: video.creator,
                authorID: video.uploader_id
            },
            videoID: video.id,
            videoTitle: video.description,
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
            watermarked: {
                watermarkedURL: video.formats[videoIndexes.watermark].url,
                watermarkedFormat: video.formats[videoIndexes.watermark].video_ext,
                watermarkedSize: video.formats[videoIndexes.watermark].filesize,
            },
            raw: {
                rawURL: video.formats[videoIndexes.clean].url,
                rawFormat: video.formats[videoIndexes.clean].video_ext,
                rawSize: video.formats[videoIndexes.clean].filesize,

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