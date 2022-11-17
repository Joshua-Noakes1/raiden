const lcl = require('cli-color');
const path = require('path');
const {
    Linguini,
    TypeMappers
} = require('linguini');

let langs = new Linguini(path.join(__dirname, 'json'), 'lang');

// return lang string to client
function mapLang(langString) {
    // return error if langString is not a string
    if (langString === "" || langString === undefined) {
        console.log(lcl.red("[Lang - Error]"), "No language string provided.");
        return {
            success: false
        }
    }

    // match langStrings to their respective language acording to discord language codes (https://discord.com/developers/docs/reference#locales)
    var currentLang = {
        success: true,
        lang: "English",
        nativeLang: "English (Fallback)",
        code: "en"
    }
    // uncomment when more languages are added
    switch (langString) {
        // case "da":
        //     currentLang.lang = "danish";
        //     currentLang.nativeLang = "dansk";
        //     currentLang.code = "da";
        //     break;
        // case "de":
        //     currentLang.lang = "german";
        //     currentLang.nativeLang = "deutsch";
        //     currentLang.code = "de";
        //     break;
        case "en-GB":
            currentLang.lang = "English";
            currentLang.nativeLang = "English (UK / US)";
            currentLang.code = "en";
            break;
        case "en-US":
            currentLang.lang = "English";
            currentLang.nativeLang = "English (US / UK)";
            currentLang.code = "en";
            break;
            case "es-ES":
                currentLang.lang = "spanish";
                currentLang.nativeLang = "español";
                currentLang.code = "es";
                break;
            // case "fr":
            //     currentLang.lang = "french";
            //     currentLang.nativeLang = "français";
            //     currentLang.code = "fr";
            //     break;
            // case "hr":
            //     currentLang.lang = "croatian";
            //     currentLang.nativeLang = "hrvatski";
            //     currentLang.code = "hr";
            //     break;
            // case "it":
            //     currentLang.lang = "italian";
            //     currentLang.nativeLang = "italiano";
            //     currentLang.code = "it";
            //     break;
            // case "lt":
            //     currentLang.lang = "lithuanian";
            //     currentLang.nativeLang = "lietuvių";
            //     currentLang.code = "lt";
            //     break;
            // case "hu":
            //     currentLang.lang = "hungarian";
            //     currentLang.nativeLang = "magyar";
            //     currentLang.code = "hu";
            //     break;
            // case "nl":
            //     currentLang.lang = "dutch";
            //     currentLang.nativeLang = "nederlands";
            //     currentLang.code = "nl";
            //     break;
            // case "no":
            //     currentLang.lang = "norwegian";
            //     currentLang.nativeLang = "norsk";
            //     currentLang.code = "no";
            //     break;
            // case "pl":
            //     currentLang.lang = "polish";
            //     currentLang.nativeLang = "polski";
            //     currentLang.code = "pl";
            //     break;
            // case "pt-BR":
            //     currentLang.lang = "Portuguese, Brazilian";
            //     currentLang.nativeLang = "Português do Brasil";
            //     currentLang.code = "pt-BR";
            //     break;
            // case "ro":
            //     currentLang.lang = "Romanian, Romania";
            //     currentLang.nativeLang = "română";
            //     currentLang.code = "ro";
            //     break;
            // case "fi":
            //     currentLang.lang = "finnish";
            //     currentLang.nativeLang = "suomi";
            //     currentLang.code = "fi";
            //     break;
            // case "sv-SE":
            //     currentLang.lang = "swedish";
            //     currentLang.nativeLang = "svenska";
            //     currentLang.code = "sv-SE";
            //     break;
            // case "vi":
            //     currentLang.lang = "vietnamese";
            //     currentLang.nativeLang = "tiếng việt";
            //     currentLang.code = "vi";
            //     break;
            // case "tr":
            //     currentLang.lang = "turkish";
            //     currentLang.nativeLang = "türkçe";
            //     currentLang.code = "tr";
            //     break;
            // case "cs":
            //     currentLang.lang = "czech";
            //     currentLang.nativeLang = "čeština";
            //     currentLang.code = "cs";
            //     break;
            // case "el":
            //     currentLang.lang = "greek";
            //     currentLang.nativeLang = "ελληνικά";
            //     currentLang.code = "el";
            //     break;
            // case "bg":
            //     currentLang.lang = "bulgarian";
            //     currentLang.nativeLang = "български";
            //     currentLang.code = "bg";
            //     break;
            // case "ru":
            //     currentLang.lang = "russian";
            //     currentLang.nativeLang = "русский";
            //     currentLang.code = "ru";
            //     break;
            // case "uk":
            //     currentLang.lang = "ukrainian";
            //     currentLang.nativeLang = "українська";
            //     currentLang.code = "uk";
            //     break;
            // case "th":
            //     currentLang.lang = "thai";
            //     currentLang.nativeLang = "ไทย";
            //     currentLang.code = "th";
            //     break;
            // case "hi":
            //     currentLang.lang = "hindi";
            //     currentLang.nativeLang = "हिन्दी";
            //     currentLang.code = "hi";
            //     break;
            // case "zh-CN":
            //     currentLang.lang = "chinese, simplified";
            //     currentLang.nativeLang = "简体中文";
            //     currentLang.code = "zh-CN";
            //     break;
            // case "ja":
            //     currentLang.lang = "japanese";
            //     currentLang.nativeLang = "日本語";
            //     currentLang.code = "ja";
            //     break;
            // case "zh-TW":
            //     currentLang.lang = "chinese, traditional";
            //     currentLang.nativeLang = "繁體中文";
            //     currentLang.code = "zh-TW";
            //     break;
            // case "ko":
            //     currentLang.lang = "korean";
            //     currentLang.nativeLang = "한국어";
            //     currentLang.code = "ko";
            //     break;
    }

    if (!currentLang.success) {
        console.log(lcl.red("[Lang - Error]"), "Failed to find language for", lcl.yellow(langString));
        return {
            success: false
        }
    }

    return currentLang;
}

// get language string from json and return a false if it doesn't exist
function getLangMatch(contentStringOrigin, lang) {
    // check if contentStringOrigin is not empty
    if (contentStringOrigin == "" || contentStringOrigin == undefined) {
        console.log(lcl.red("[Lang - Error]"), "Content string is empty or undefined");
        return "Content string is empty or undefined";
    }

    var contantString = "";

    try {
        contantString = langs.get(contentStringOrigin, lang, TypeMappers.String)

    } catch (err) {
        // try and get the english version of the string if it doesn't exist
        try {
            contantString = langs.get(contentStringOrigin, "en", TypeMappers.String)
        } catch (err) {
            console.log(lcl.red("[Lang - Error]"), "Failed to find language for", lcl.yellow(contentStringOrigin));
            return "Failed to find language for " + contentStringOrigin;
        }

        if (contantString == "" || contantString == undefined) {
            console.log(lcl.red("[Lang - Error]"), "Failed to find content string for", lcl.yellow(contentStringOrigin), "in", lcl.yellow(lang));
            console.log(lcl.red("[Lang - Error]"), err.message);
            return "Failed to find content string for " + contentStringOrigin + " in " + lang;
        }
    }

    return contantString;
}

module.exports = {
    mapLang,
    getLangMatch
}