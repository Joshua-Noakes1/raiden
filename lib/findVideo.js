async function findVideo(type, formats) {
    // video format block
    var videoFormat = {
        "watermark": {
            "success": false,
            "url": "",
            "size": 0,
            "format": "",
        },
        "clean": {
            "success": false,
            "url": "",
            "size": 0,
            "format": "",
        }
    };

    for (const videos in formats) {
        if (type === "watermark") {
            if (formats[videos].format_note.toString().toLowerCase().includes("watermarked") && formats[videos].source_preference >= -2 && !videoFormat.watermark.success && !formats[videos].format_note.toString().toLowerCase().includes("(api)")) {
                videoFormat.watermark.url = formats[videos].url;
                videoFormat.watermark.size = formats[videos].filesize;
                videoFormat.watermark.format = formats[videos].ext;
                videoFormat.watermark.success = true;
            }
        } else if (type === "clean") {
            if (formats[videos].format_note.toString().toLowerCase().includes("playback") && formats[videos].source_preference >= -1 && !videoFormat.clean.success && !formats[videos].format_note.toString().toLowerCase().includes("(api)")) {
                videoFormat.clean.url = formats[videos].url;
                videoFormat.clean.size = formats[videos].filesize;
                videoFormat.clean.format = formats[videos].ext;
                videoFormat.clean.success = true;
            }
        }
    }

    switch (type) {
        case "watermark":
            if (videoFormat.watermark.success) {
                return videoFormat.watermark;
            } else {
                return {
                    success: false
                };
            }
            break;
        case "clean":
            if (videoFormat.clean.success) {
                return videoFormat.clean;
            } else {
                return {
                    success: false
                };
            }
            break;
    }
}

module.exports = findVideo;