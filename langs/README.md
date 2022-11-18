# Langs

Raiden uses LinguiJS to manage translations. The translations are stored in the `langs/locales` folder.

## Adding a new language

To add a new language, you need to copy the `local.en.json` file and rename it to the language you want to add. For example, if you want to add Spanish support you would copy `local.en.json` to `local.es.json`.

Translate the strings in the new file (except the `info` and `uuid` strings) and then uncomment the new language in the `langs/getLangs.js` file.

1. Copy `local.en.json` to `local.es.json`  
   ![https://raw.githubusercontent.com/Joshua-Noakes1/raiden/raiden/.github/images/copyLang.png](https://raw.githubusercontent.com/Joshua-Noakes1/raiden/raiden/.github/images/copyLang.png)

2. Translate the strings in the new file  
   ![https://raw.githubusercontent.com/Joshua-Noakes1/raiden/raiden/.github/images/translate.png](https://raw.githubusercontent.com/Joshua-Noakes1/raiden/raiden/.github/images/translate.png)

3. Uncomment the new language in `langs/getLangs.js`  
   ![https://raw.githubusercontent.com/Joshua-Noakes1/raiden/raiden/.github/images/code.png](https://raw.githubusercontent.com/Joshua-Noakes1/raiden/raiden/.github/images/code.png)
