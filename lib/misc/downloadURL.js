const lcl = require('cli-color'),
    {
        writeFileSync
    } = require('fs'),
    fetch = require('node-fetch');

    // download url buffer and save to fs
async function downloadBuffer(URL, saveFS, bufferType) {
    try {
        let buffer = await fetch(URL);
        buffer = await buffer.buffer();
        await writeFileSync(saveFS, buffer);
        return {
            success: true
        }
    } catch (error) {
        console.log(lcl.red("[Fetch - Error]"), `Error while downloading ${bufferType}`);
        if (process.env.dev == "true") console.log(error);
        return {
            success: false
        };
    }
}

module.exports = downloadBuffer;