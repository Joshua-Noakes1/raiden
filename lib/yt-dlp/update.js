const lcl = require('cli-color'),
    path = require('path'),
    fetch = require('node-fetch'),
    {
        readJSON,
        writeJSON
    } = require('../readWrite');

async function updateYTDLP() {
    // load version
    let version = await readJSON(path.join(__dirname, 'version.json'));
    if (version.success != true) version = {
        success: true,
        version: "0.0.0"
    };

    // user has set update to false
    if (process.env.update == "false" && version.version != "0.0.0") {
        console.log(lcl.yellow("[YT-DLP - Info]"), "Auto-Updates disabled, skipping update");
        return {
            success: true
        }
    };

    // get latest version from ghapi
}

module.exports = updateYTDLP;