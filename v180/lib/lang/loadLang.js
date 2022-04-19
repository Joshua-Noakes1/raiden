require('dotnev').config();

function loadLang() {
    // Load language
    const lang = require(`./lang/${process.env.LANG.toString().toLowerCase()}.json`);
    return lang;
}

module.exports = loadLang;