const fetch = require('node-fetch');
const fs = require('fs').promises;
const base64Img = require('base64-img');
const imgToText = require("../../Modules/OCR-Server/requestOCR.js")
const processListOfCoordinates = require("./processListOfCoordinates.js")
const translateTextOffline = require("./translateTextOffline.js")


// async function sendMessageToServer(thisContent, thisMessage) {  
// 	let result = await fetch(`http://localhost:3567/`)
// 	console.log(await result.text())
// 		//.then(res => res.json())
// 		//.then(json => console.log(json));
// }

// sendMessageToServer("ありがとう。来てくれて、嬉しいよ", "test")


// function sendMessageToServer(thisContent, thisMessage) {  
// 	fetch(`http://localhost:3567/`, {
// 			method: 'post',
// 			body:    JSON.stringify({content: thisContent, message: thisMessage}),
// 			headers: { 'Content-Type': 'application/json' },
// 		})
// 		.then(res => console.log(res))
// 		//.then(res => res.json())
// 		//.then(json => console.log(json));
// }

//VERY IMPORTANT: The list of textbox coordinates need to be processed via processListOfCoordinates. This caused conflict between flask server and this file
//I ported the function to the python file but later on maybe need only one way instead of doing both on js and py
async function getListOfTextboxInfo() {
	const imageData = base64Img.base64Sync('./wholeImage.png');
	const response = await fetch("http://localhost:7575/", {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({imageFile: imageData, message: "get all textboxes info"})
		// body: JSON.stringify({imageFile: imageData, message: "detect all textboxes"})
	})
	
	const textData = await response.json()
	console.log(textData) 
	return textData
}

async function getTextInEachImage(listOfTextboxInfo) {
	let updatedListOfTextboxInfo = listOfTextboxInfo
  
	let index = 0
	for (const textboxInfoObject of listOfTextboxInfo) {
		const textboxImagePath = textboxInfoObject.imagePath
		const textContent = await imgToText(textboxImagePath)
		updatedListOfTextboxInfo[index].textContent = textContent
		console.log(textContent);
		index++
	}
	
	return updatedListOfTextboxInfo
}

async function getTranslationForEachImage(listOfTextboxInfo) {
	let updatedListOfTextboxInfo = listOfTextboxInfo
  
	let index = 0
	for (const textboxInfoObject of listOfTextboxInfo) {
		const textContent = textboxInfoObject.textContent
		const translationText = await translateTextOffline(textContent)
		updatedListOfTextboxInfo[index].translationText = translationText
		console.log(translationText);
		index++
	}
	
	return updatedListOfTextboxInfo
}


async function translateMangaPage() {
	const listOfTextboxInfo = await getListOfTextboxInfo()
	const updatedListWithTextInImage = await getTextInEachImage(listOfTextboxInfo)
	const updatedListWithTranslationText = await getTranslationForEachImage(updatedListWithTextInImage)
	const data = JSON.stringify(updatedListWithTranslationText, null, 4);
	fs.writeFile('user.json', data)
}

translateMangaPage()