const lcl = require("cli-color");
const ytdlp = require('../../lib/ytdlp');
const fetch = require("node-fetch");
const downloadMedia = require("../../lib/downloadMedia");
const { execSync } = require("child_process");
const { statSync } = require("fs");

async function youtubeHandle(url) {
    try {
        // get URL from YouTube
        var videoInfo = await ytdlp(url);
        if (!videoInfo.success) {
            return {
                success: false
            }
        }
        videoInfo = videoInfo.videoInfo;

        // extract video into format 
        var videoInfoJSON = {
            "creator": {
                "id": videoInfo.channel_id,
                "name": videoInfo.uploader,
                "username": videoInfo.uploader_id,
                "avatar": "",
                "url": videoInfo.channel_url
            },
            "video": {
                "id": videoInfo.id,
                "title": videoInfo.title,
                "description": videoInfo.description,
                "thumbnail": videoInfo.thumbnail,
                "length": videoInfo.duration,
                "views": videoInfo.view_count,
                "ageGate": videoInfo.age_limit === 0 ? false : true,
                "url": videoInfo.webpage_url,
                "media": []
            },
            "media": []
        }

        // get creator avatar
        try {
            var googleAPI = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${videoInfoJSON.creator.id}&key=${process.env.YOUTUBE_API}`);
            if (googleAPI.status !== 200) {
                console.log(lcl.yellow("[YouTube - Warn]"), `Failed to get creator avatar. Status Code: ${googleAPI.status}`);
            } else {
                var googleAPIJSON = await googleAPI.json();
                videoInfoJSON.creator.avatar = googleAPIJSON.items[0].snippet.thumbnails.default.url;
            }
        } catch (err) {
            console.log(lcl.yellow("[YouTube - Warn]"), `Failed to get creator avatar. ${err}`);
        }

        // get media from video, audio and avatar
        for (var reqFormats of videoInfo.requested_formats) {
            try {
                let media = await downloadMedia(reqFormats.url, reqFormats.ext);
                if (!media.success) {
                    console.log(lcl.yellow("[YouTube - Warn]"), "Failed to get media.");
                } else {
                    videoInfoJSON.video.media.push({
                        "id": media.mediaUUID,
                        "url": reqFormats.url,
                        "path": media.mediaPath,
                        "size": media.fileSize,
                        "format": reqFormats.format_note,
                        "quality": reqFormats.quality,
                        "ext": reqFormats.ext,
                        "type": reqFormats.vcodec === "none" ? "audio" : "video"
                    });
                }
            } catch (err) {
                console.log(lcl.yellow("[YouTube - Warn]"), `Failed to get media. ${reqFormats.format_note} ${reqFormats.quality} ${reqFormats.ext}`);
            }
        }
        if (videoInfoJSON.creator.avatar !== "") {
            try {
                let media = await downloadMedia(videoInfoJSON.creator.avatar, "jpg");
                if (!media.success) {
                    console.log(lcl.yellow("[YouTube - Warn]"), "Failed to get creator avatar.");
                } else {
                    videoInfoJSON.media.push({
                        "id": media.mediaUUID,
                        "url": videoInfoJSON.creator.avatar,
                        "path": media.mediaPath,
                        "size": media.fileSize,
                        "format": "avatar",
                        "quality": "default",
                        "ext": "jpg",
                        "type": "extra"
                    })
                }
            } catch (err) {
                console.log(lcl.yellow("[YouTube - Warn]"), `Failed to get creator avatar. ${err}`);
            }
        }

        // in the case of YouTube we need to combine the video and audio; this also allows us to convert to mp4 ffmpeg
        var videoMedia = videoInfoJSON.video.media.find(media => media.type === "video");
        var audioMedia = videoInfoJSON.video.media.find(media => media.type === "audio");
        if (videoMedia && audioMedia) {
            var videoPath = videoMedia.path;
            var audioPath = audioMedia.path;
            var ffmpeg = await execSync(`ffmpeg -i ${videoPath}.${videoMedia.ext} -i ${audioPath}.${audioMedia.ext} -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 -hide_banner -loglevel error ${videoPath}.mp4`);
            console.log(ffmpeg.toString());
            if (ffmpeg.toString() !== "") {
                console.log(lcl.yellow("[YouTube - Warn]"), `Failed to combine video and audio.`);
            } else {
                videoInfoJSON.media.push({
                    "id": videoMedia.id,
                    "url": videoMedia.url,
                    "path": videoPath,
                    "size": statSync(`${videoPath}.mp4`).size,
                    "format": "video",
                    "quality": videoMedia.quality,
                    "ext": "mp4",
                    "type": "video"
                });
            }
        }

        return {
            success: true,
            videoInfo: videoInfoJSON
        }
    } catch (err) {
        console.log(lcl.red("[YouTube - Error]"), err);
        return {
            success: false
        }
    }
}

module.exports = youtubeHandle;