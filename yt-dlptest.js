const youtubedl = require('youtube-dl-exec');
const {
    writeFileSync
} = require('fs');
const path = require('path');

youtubedl('https://www.tiktok.com/@foxplushy/', {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    // preferFreeFormats: true,
    // youtubeSkipDashManifest: true,
    referer: 'https://www.tiktok.com/'
}).then(output => {
    writeFileSync(path.join(__dirname, 'output.json'), JSON.stringify(output, null, 2))
});