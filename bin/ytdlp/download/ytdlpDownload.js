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
        if (process.platform == 'darwin' || process.platform == 'linux') await exec(`chmod +x ${path.join(__dirname, '../', 'bin', `ytdlp${platform}`)}`);

        // return success
        return {
            success: true,
            message: `Downloaded YTDLP`
        };
    } catch (error) {
        console.log(lcl.red("[YTDLP Download - Error]"), "Failed to download YTDLP", error);
        return process.exit(1);
    }
}

module.exports = fetchDownload;