const { translate } = require('bing-translate-api');

module.exports = async function requestBingTranslation(originalLang, mainText, languageDesired) {
    let translation = new Promise( (resolve, reject) => {translate(mainText, originalLang, languageDesired, true).then(res => {
        resolve(res.translation);
      }).catch(err => {
        console.error(err);
      });
    })
    return translation
} 

