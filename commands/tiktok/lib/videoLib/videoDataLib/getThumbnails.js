async function getThumbnail(thumbnails, imageType) {

    var thumbnailURL = '';

    await asyncForEach(thumbnails, async (thumbnail, index, array) => {
        // return image if type matches
        switch (imageType) {
            case 'static':
                if (thumbnail.id == 'origin_cover') {
                    thumbnailURL = thumbnail.url;
                }
                break;
            case 'dynamic':
                if (thumbnail.id == 'dynamic_cover') {
                    thumbnailURL = thumbnail.url;
                }
                break;
            default:
                thumbnailURL = 'https://raw.githubusercontent.com/Joshua-Noakes1/Lake-CDN/master/CDN/Other%20Repos/motherVanessa/subway-subway-sandwich.gif';
                break;
        }
    });

    return thumbnailURL;
}
// fix callback hell 
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = getThumbnail;