const youtubedl = require('youtube-dl-exec');
const {
    writeFileSync
} = require('fs');
const path = require('path');

youtubedl('https://www.tiktok.com/@foxplushy/video/7118815581230435626?is_copy_url=1&is_from_webapp=v1', {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    referer: 'https://www.tiktok.com/@foxplushy/video/7118815581230435626?is_copy_url=1&is_from_webapp=v1'
}).then(output => {
    writeFileSync(path.join(__dirname, 'output.json'), JSON.stringify(output, null, 2))
});