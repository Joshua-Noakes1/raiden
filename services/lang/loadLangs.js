require('dotenv').config();
const lcl = require('cli-color'),
    path = require('path');

function loadLangs(filename) {
    // dev logging
    if (process.env.DEV_MODE == "true") {
        console.log(lcl.yellow("[Lang - Info]"), `Loading Languages for "${filename || "Unknown"}"...`);
    }

    // load languages and return 
    try {
        var lang = require(path.join(__dirname, 'langs', `${process.env.XLANG.toString().toLocaleLowerCase()}.json`));
    } catch (err) {
        console.log(lcl.red("[Lang - Error]"), `Failed to load language file "${process.env.XLANG.toString().toLocaleLowerCase()}"`, `\n${lcl.red("[Lang - Error]")} ${err.message}`);
        return process.exit(1);
    }
    if (!lang.success) {
        console.log(lcl.red("[Lang - Error]"), `Failed to load language file "${process.env.XLANG.toString().toLocaleLowerCase()}"`);
        return process.exit(1);
    }

    return lang;
}

module.exports = loadLangs;