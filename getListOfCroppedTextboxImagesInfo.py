import cv2
import numpy as np 
import json
from pathlib import Path
import os
import shutil


# listOfPossibleTextboxCoordinates = [
# 	[ 380, 134, 16, 11 ],     [ 957, 149, 9, 40 ],     [ 784, 156, 6, 5 ],     
# 	[ 1051, 158, 110, 308 ],  [ 201, 166, 58, 259 ],   [ 384, 190, 66, 185 ],  
# 	[ 291, 205, 17, 253 ],    [ 730, 261, 10, 26 ],    [ 757, 294, 52, 21 ],   
# 	[ 154, 310, 17, 148 ],    [ 705, 369, 16, 4 ],     [ 880, 369, 67, 121 ],  
# 	[ 422, 380, 23, 26 ],     [ 626, 415, 5, 13 ],     [ 699, 545, 9, 23 ],    
# 	[ 1131, 563, 90, 134 ],   [ 946, 572, 60, 32 ],    [ 194, 603, 123, 75 ],  
# 	[ 382, 607, 91, 187 ],    [ 632, 616, 27, 65 ],    [ 774, 656, 92, 214 ],  
# 	[ 533, 660, 7, 4 ],       [ 681, 671, 25, 248 ],   [ 1005, 688, 23, 33 ],  
# 	[ 1106, 693, 5, 58 ],     [ 81, 698, 107, 213 ],   [ 934, 719, 31, 24 ],   
# 	[ 989, 773, 42, 14 ],     [ 963, 780, 23, 8 ],     [ 955, 788, 8, 5 ],     
# 	[ 1046, 803, 22, 15 ],    [ 513, 864, 17, 40 ],    [ 904, 867, 29, 18 ],   
# 	[ 1074, 976, 142, 231 ],  [ 450, 977, 58, 186 ],   [ 153, 994, 58, 185 ],  
# 	[ 712, 1007, 4, 3 ],      [ 960, 1017, 6, 4 ],     [ 362, 1019, 6, 6 ],    
# 	[ 593, 1021, 23, 9 ],     [ 829, 1220, 202, 305 ], [ 292, 1245, 34, 8 ],   
# 	[ 580, 1250, 69, 101 ],   [ 441, 1272, 44, 22 ],   [ 991, 1276, 188, 9 ],  
# 	[ 666, 1277, 54, 101 ],   [ 108, 1293, 67, 210 ],  [ 420, 1301, 132, 127 ],
# 	[ 1066, 1347, 10, 4 ],    [ 1102, 1347, 74, 9 ],   [ 760, 1359, 6, 7 ],    
# 	[ 996, 1394, 3, 9 ],      [ 806, 1401, 3, 8 ],     [ 649, 1411, 10, 3 ],   
# 	[ 733, 1426, 90, 39 ],    [ 623, 1435, 36, 29 ],   [ 471, 1438, 17, 8 ],
# 	[ 502, 1452, 3, 7 ],      [ 711, 1467, 6, 9 ],     [ 993, 1512, 5, 6 ],
# 	[ 1092, 1587, 120, 207 ], [ 982, 1588, 66, 57 ],   [ 751, 1600, 89, 147 ],
# 	[ 535, 1609, 171, 25 ],   [ 126, 1629, 57, 181 ],  [ 350, 1684, 99, 125 ],
# 	[ 1040, 1710, 10, 14 ],   [ 194, 1717, 38, 112 ],  [ 945, 1722, 8, 30 ],
# 	[ 537, 1754, 8, 24 ],     [ 996, 1779, 57, 50 ]
# ]


def getListOfCroppedTextboxImagesInfo(listOfPossibleTextboxCoordinates):
	listOfPotentialTextBoxImages = []
	outputFolder = "testImages/"
	originalImage = cv2.imread("./wholeImage.png")
	imageHeight, imageWidth, channels = originalImage.shape

	shutil.rmtree(outputFolder)
	os.makedirs(outputFolder)

	minimumWidth = imageWidth/35 

	for i, coordinate in enumerate(listOfPossibleTextboxCoordinates):
		x1 = coordinate[0]
		y1 = coordinate[1]
		x2 = coordinate[2]
		y2 = coordinate[3]
		width = x2 - x1
		height = y2 - y1

		if (width > height or width < minimumWidth):
			print("this is likely not a text box")
		else:
			potentialTextBoxImage = originalImage[y1:y2, x1:x2]
			cv2.imwrite(outputFolder + f'{str(i)}.png', potentialTextBoxImage)
			textboxImageAbsolutePath = os.path.abspath(f"{outputFolder}/{str(i)}.png")
			listOfPotentialTextBoxImages.append({"imagePath": textboxImageAbsolutePath, "coordinate": {"x1": x1, "y1": y1, "width": width, "height": height, "x2": x2, "y2": y2}})

	with open('data.json', 'w', encoding='utf-8') as f:
		json.dump(listOfPotentialTextBoxImages, f, ensure_ascii=False, indent=4)

	return listOfPotentialTextBoxImages

