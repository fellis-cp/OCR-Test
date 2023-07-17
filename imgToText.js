const configFile = require("./User-Settings.json")
const OCRlanguage = configFile["OCR-language"]

const tesseract = require("./node-tesseract-ocr.js")

console.log(OCRlanguage)
module.exports =  async function (imageFile) {
	const config = {
		//lang: "jpn_vert+jpn+chi_tra_vert",
		lang: OCRlanguage["Tesseract-Code"],
		oem: 1,
		psm: OCRlanguage["Tesseract-Text-Orientation"],
		// preserve_interword_spaces:1
	}

	try{
		text = await tesseract.recognize(imageFile, config)
	}
	catch(error){
		console.log(error.message)
	}

	text = text.replace(/-\r\n\r\n/g, '') //remove -text partern which is common in latin-language to indicate word continuation in next line 
	text = text.replace(/-\r\n/g, '') //remove -text partern which is common in latin-language to indicate word continuation in next line 
	text = text.replace(/-\r/g, '') //remove -text partern which is common in latin-language to indicate word continuation in next line 
	text = text.replace(/-\n/g, '') //remove -text partern which is common in latin-language to indicate word continuation in next line 

	text = text.replace(/  /g, '') //remove double space
	text = text.replace(/\r\n/g, ' ') //remove leftover carriage return
	text = text.replace(/\r/g, ' ') //remove newline character /n with space
	text = text.replace(/\n/g, '') //remove carriage return character /r 

	const jpTextWithNoSpace = text.replace(/\s/g, '')

	if (OCRlanguage["Include-Space"] === true) {
		return text
	}
	else {
		return processExtractedText(jpTextWithNoSpace) 
	}

	

}


function processExtractedText(extractedText) {
	let result = ""

	result = extractedText.replace(/:/g, "")
	result = result.replace("先昔", "先輩");
	result = result.replace("{", "")	
	result = result.replace("}", "")	
	result = result.replace("||", "")
	result = result.replace("~", "")	
	result = result.replace("〈", "")
	result = result.replace("<", "")
	result = result.replace("〆", "")
	result = result.replace("(", "")
	result = result.replace(")", "")
	result = result.replace(/カ$/, "");
	result = result.replace(/リ$/, "");
	result = result.replace(/p$/, "");
	result = result.replace(/・$/, "");
	result = result.replace(/ブ$/, "");
	result = result.replace(/③$/, "");
	result = result.replace(/②$/, "");
	result = result.replace(/ジ$/, "");
	result = result.replace(/ひ$/, "");
	result = result.replace(/フ$/, "");

	result = result.replace("=", "!")
	result = result.replace("/", "!");
	result = result.replace(/ダグ/g, "!")
	result = result.replace(/グ$/, "!");
	result = result.replace(/ダ$/, "!");
	result = result.replace(/グ!/, "!");
	result = result.replace(/ク$/, "!");
	result = result.replace(/2$/, "!");
	result = result.replace(/ノ!$/, "!");
	result = result.replace(/ノ!!$/, "!");
	result = result.replace(/リ!$/, "!");
	
	
	result = result.replace(/9$/, "?");
	result = result.replace("9?", "?")


	result = result.replace(/ー1/g, "ー")
	result = result.replace(/1/g, "ー");
	result = result.replace("|", "")

	
	return result
}