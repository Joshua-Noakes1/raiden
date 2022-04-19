require('dotenv').config();
const lcl = require('cli-color'),
    path = require('path');

function loadLangs() {
    // dev logging
    if (process.env.DEV_MODE == "true") {
        console.log(lcl.yellow("[Lang]"), "Loading Languages...");
    }

    // load languages and return 
    const lang = require(path.join(__dirname, 'langs', `${process.env.XLANG.toString().toLocaleLowerCase()}.json`));
    if (!lang.success) {
        console.log(lcl.red("[Lang]"), "Failed to load language file");
        return process.exit(1);
    }

    return lang;
}

module.exports = loadLangs;