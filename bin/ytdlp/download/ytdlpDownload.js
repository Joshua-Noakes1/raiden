const lcl = require('cli-color'),
    path = require('path'),
    {
        writeFileSync
    } = require('fs'),
    {
        exec
    } = require('child_process'),
    fetch = require('node-fetch');

async function fetchDownload(URL, platform) {
    try {
        // try download 
        var YTDLPExec = await fetch(URL);
        YTDLPExec = await YTDLPExec.buffer();

        // write to file
        await writeFileSync(path.join(__dirname, '../', 'bin', `ytdlp-exec${platform}`), YTDLPExec);

        // make file executable for user 
        if (process.platform == 'darwin' || process.platform == 'linux') await exec(`chmod +x ${path.join(__dirname, '../', 'bin', `ytdlp-exec${platform}`)}`);

        // return success
        return {
            success: true
        };
    } catch (error) {
        console.log(lcl.red("[Fetch - Error]"), "Failed to download YTDLP", error);
        return {
            success: false
        }
    }
}

module.exports = fetchDownload;