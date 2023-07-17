let translateTextOffline = require("./translateTextOffline.js")
const imgToText = require("../../Modules/OCR-Server/requestOCR.js")

module.exports =  async function translateTextInImage(imageFile) {
    let jpText = await imgToText(imageFile)
    let englishText = ""
    if (jpText == "") {
        englishText = ""
    }
    else {
        englishText = await translateTextOffline(jpText)
    }
    return {extracted:jpText, translated:englishText}
}

