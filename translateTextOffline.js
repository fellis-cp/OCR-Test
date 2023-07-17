const fetch = require('node-fetch');

let serverPort = 14366
// let serverPort = 14467


module.exports = async function translateTextOffline(originalText) {
	const result = await sendMessageToServer("translate sentences", originalText)
	return result
}

async function sendMessageToServer(thisMessage, thisContent) {  
	let translation = await fetch(`http://localhost:${serverPort}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
        })
    return translation.json()
}

