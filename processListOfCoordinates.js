module.exports = async (listOfCoordinates) => {
    function addWidthHeightToArray(coordinatesArray) {
        let arrayToWorkWith = coordinatesArray
        let width = arrayToWorkWith[2] - arrayToWorkWith[0]
        let height = arrayToWorkWith[3] - arrayToWorkWith[1]
        let xCoordinate = arrayToWorkWith[0]
        let yCoordinate = arrayToWorkWith[1]
        let resultArray = [xCoordinate, yCoordinate, width, height]
        return resultArray
    }

    let listWithNoWidthHeight = await listOfCoordinates
    let arrayWithWidthHeight = listWithNoWidthHeight.map(coordinatesArray => addWidthHeightToArray(coordinatesArray));
    return arrayWithWidthHeight
}


