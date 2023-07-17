from flask import Flask
from flask import request
import requests

import json
import cv2
import os 
from time import sleep

from getListOfCroppedTextboxImagesInfo import getListOfCroppedTextboxImagesInfo

import sys
sys.path.insert(0, '../../Modules/')


userSettingsPath = open("../../../User-Settings.json", encoding='utf8')
userSettings = json.load(userSettingsPath)
pythonFlaskServerPortNumber = userSettings["test_OCR"]["pythonFlaskServerPortNumber"]


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods = ['POST'])


def sendTextboxesToMainServer():
    data = request.get_json()
    message = data.get("message")
    content = data.get("content")
    
    imageFullPath = os.path.abspath("wholeImage.png")

    print(message)

    if (message == "detect all textboxes"):
        # in case of images not detected restart
        try:
            listOfTextboxCoordinates = getListOfTextBoxes(imageFullPath)
            
        except cv2.error as e:
            print("#########################################")
            print("cv2 error, restart now")
            print("#########################################")

            sleep(0.3)
            listOfTextboxCoordinates = getListOfTextBoxes(imageFullPath)
        print(listOfTextboxCoordinates)
        return json.dumps(listOfTextboxCoordinates)
    
    if (message == "get all textboxes info"):
        listOfTextboxCoordinates = getListOfTextBoxes(imageFullPath)
        listOfTextboxInfo = getListOfCroppedTextboxImagesInfo(listOfTextboxCoordinates)
        return json.dumps(listOfTextboxInfo)

    if (message == "close server"):
        shutdown_server()

    return json.dumps(content)

def getListOfTextBoxes(imagePath):
    url = 'http://localhost:7676/'
    myobj = {'message': 'detect text in image', "content": imagePath}
    result = requests.post(url, json = myobj)
    return result.json()

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=pythonFlaskServerPortNumber)
