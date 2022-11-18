function findThumbnail(thumbnails, type) {
    // thumbnail obj
    var thumbnailObject = {
        "dynamic": {
            "success": true,
            "url": "",
        },
        "static": {
            "success": true,
            "url": "",
        }
    }

    // find static thumbnail
    for (const image in thumbnails) {
        if (type == "static") {
            if (thumbnails[image].id == "cover" && !thumbnailObject.static.success) {
                thumbnailObject.static.url = thumbnails[image].url;
                thumbnailObject.static.success = true;
            }
        }
        if (type == "dynamic") {
            if (thumbnails[image].id == "dynamic_cover" && !thumbnailObject.dynamic.success) {
                thumbnailObject.dynamic.url = thumbnails[image].url;
                thumbnailObject.dynamic.success = true;
            }
        }
    }

    // return thumbnail object
    switch (type) {
        case "static":
            if (thumbnailObject.static.success) {
                return thumbnailObject.static;
            } else {
                return {
                    "success": false
                }
            }
            break;
        case "dynamic":
            if (thumbnailObject.dynamic.success) {
                return thumbnailObject.dynamic;
            } else {
                return {
                    "success": false
                }
            }
            break;
    }
}

module.exports = findThumbnail;