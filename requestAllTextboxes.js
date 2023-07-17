// module.exports = async () => {
//     let result = new Promise ( (resolve, reject) => {

//         const {spawn} = require('child_process');
//         const processListOfCoordinates = require("./processListOfCoordinates.js")
//         const python = spawn('python3', ['extractAllImageText.py']);
//         const listOfCoordinatesArrays = [];

    

//         python.stdout.on('data', (data) => {
//             console.log('Pipe data from python script ...');
//             listOfCoordinatesArrays.push(data);
//             let list = JSON.parse(listOfCoordinatesArrays.join(""))
//             resolve(processListOfCoordinates(list)) 
//         });

//         python.stderr.on('data', function(data) {
//             console.error(data.toString());
//         });
//     })
//     return result
// }


// const request = require('request');
// const processListOfCoordinates = require("./processListOfCoordinates.js")

// module.exports = async () => {
//     let listOftextboxes = new Promise( (resolve, reject) => {request.post({url:'http://localhost:7575/'}, function optionalCallback(err, httpResponse, body) {
//             if (err) {
//                 return console.error('connection to flask server failed', err);
//             }
//             resolve(processListOfCoordinates(JSON.parse(body)))
//         })
//     })
//     return listOftextboxes
// } 


const fetch = require('node-fetch');
const processListOfCoordinates = require("./processListOfCoordinates.js")

module.exports = async () => {
    let listOftextboxes = await sendMessageToServer(7575, "no content", "detect all textboxes")
    return listOftextboxes
	// return processListOfCoordinates(listOftextboxes)
} 

async function sendMessageToServer(serverPort, thisContent, thisMessage) {  
	const response = await fetch(`http://localhost:${serverPort}/`, {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({content: thisContent, message: thisMessage})
	})

	const textData = await response.json()
	return textData
}