const fs = require('fs') 

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const base64Img = require('base64-img');
const fetch = require('node-fetch');
const exec = require('child_process').exec;

const translateTextInImage = require("./imgTranslation.js")
const requestAllTextBoxes = require("./requestAllTextboxes.js")
const imgToText = require("../../Modules/OCR-Server/requestOCR.js")
let translateTextOffline = require("./translateTextOffline.js")


const listOfVariablesData = require("../../../User-Settings.json")
const HTTPserverPortNumber = listOfVariablesData.test_OCR.HTTPserverPortNumber

const GoogleAnalytics = require("../../Modules/Google-Analytics/GoogleAnalytics.js")
const googleAnalytics = new GoogleAnalytics()
googleAnalytics.logPageView("/mangarikaiocr")
// const websocketServerPortNumber = listOfVariablesData.Manga_Rikai_OCR.websocketServerPortNumber


// const WebSocket = require('ws');
// const webSocketServer = new WebSocket.Server({ port: websocketServerPortNumber });

// let mangaRikaiClient = []

// webSocketServer.on('connection', (webSocketConnection) => {
// 	webSocketConnection.on('message', async (data) => {
// 		let parsedData = JSON.parse(data)

// 		let message = parsedData.message
// 		let content = parsedData.content

// 		console.log('received: %s', message);

// 		if (message == "add manga rikai client connection") {
// 			console.log("successfully added client via websocket")
// 			mangaRikaiClient.push(webSocketConnection)
// 		}

// 		if (message == "translate all pages") {
// 			console.log("translate all pages")
// 		}

// 		if (message == "close server") {
// 			res.send(JSON.stringify({content: "no content", message: "node server closing"}))
// 			process.exit()
// 		}

// 	});

// 	webSocketConnection.on('close', () => {
// 		removeElementFromArray(webSocketConnection, mangaRikaiClient)
// 	});

// });


app.use(cors())
app.use(bodyParser.json({limit: '100mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}))


function closeTranslationAggregator() {
  exec('taskkill /f /im TranslationAggregator.exe');
};

function translateCroppedImage(imageFile, res) {
    base64Img.img(imageFile, '.', 'croppedImage', function(err, filepath) {});
    Promise.resolve(translateTextInImage('croppedImage.png'))
    .then(result => {
      console.log(result)
      res.send(JSON.stringify(result))
    })
}

function detectAllTextboxes(imageFile, res) {
    base64Img.img(imageFile, '.', 'wholeImage', function(err, filepath) {});
    Promise.resolve(requestAllTextBoxes()).then(result => {
      console.log(result)
      res.send(JSON.stringify(result))
    })
}

async function extractTextFromImage(imageFile, res) {
    base64Img.img(imageFile, '.', 'croppedImage', function(err, filepath) {});
    Promise.resolve(imgToText('croppedImage.png'))
    .then(result => {
      console.log(result)
      res.send(JSON.stringify(result))
    })
}

function sendMessageToServer(serverPort, thisContent, thisMessage) {  
	fetch(`http://localhost:${serverPort}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.json())
		.then(json => console.log(json));
}

app.post('/', async function (req, res) {
    const body = req.body;
    let content = body.content
    let message = body.message 

    if(message == "translate cropped image") {
        translateCroppedImage(content, res)
    }

	if(message == "translate text") {
        let translatedText = await translateTextOffline(body.content)
		res.send(JSON.stringify(translatedText))
    }

    if(message == "detect all textboxes") {
        detectAllTextboxes(content, res)
    }

    if(message == "extract text in cropped image") {
        extractTextFromImage(content, res)
    }

	if (message == "save translation data to file") {
		let translationData = content
		fs.writeFileSync('translationData.json', JSON.stringify(translationData, null, 4));
		res.send(JSON.stringify("translation data saved"))
	}

    if(message == "close translation aggregator") {
        closeTranslationAggregator()
		res.send(JSON.stringify("done"))
    }

    if(message == "close everything") {
		//res.send(JSON.stringify("done"))
		process.exit()
      //await sendMessageToServer(7575, "no content", "close server") 
      // res.send(JSON.stringify({content: "no content", message: "node server closing"}))
      // process.exit()
    }
});

app.listen(HTTPserverPortNumber, function (err) {
  if (err) {
    throw err;
  }

  console.log(`Server started on port ${HTTPserverPortNumber}`);
});