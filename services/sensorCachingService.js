var sensors = {}

/**
 *Retrieve the last known temperature/humidity form a specific sensor
 * @author Lars
 * @param {entry} entry The sensor entry that you want to add to the cache
 */
function retrieveLastValue(entry) {
    const key = generateCacheKey(entry);
    if(sensors[key]){
        return sensors[key].value
    }
    return null
}

/**
 * Store the current value in the sensors obj
 * @author Lars
 * @param {entry} entry The sensor entry that you want to add to the cache
 */
function storeCurrentValue(entry){
    sensors[generateCacheKey(entry)] = entry
}

//This function is disables for now
// /**
//  * Retrieve the maximum temperature/humidity for a specific floor.
//  * @author Lars
//  * @param {floor} floor The floor you want to recieve the max temp of.
//  */
// function getMaxTemp(floor){
//     var highestTemp
//     for(var element of sensorTemperaturesFromFloor(floor)){
//         if(!highestTemp || element.value > highestTemp){
//             highestTemp = element.value
//         }
//     }
//     return highestTemp
// }

//This function is disables for now
// /**
//  * Retrieve the minimum temperature/humidity for a specific floor.
//  * @author Lars
//  * @param {floor} floor The floor you want to recieve the min temp of.
//  */
// function getMinTemp(floor){
//     var lowestTemp
//     for(var element of sensorTemperaturesFromFloor(floor)){
//         if(!lowestTemp || element.value < lowestTemp){
//             lowestTemp = element.value
//         }
//     }
//     return lowestTemp
// }

module.exports = {retrieveLastValue, storeCurrentValue}


/**
 * Check required fields and return the key used to retrieve/store in the sensors obj
 * @author Lars
 * @param {entry} entry The whole sensor entry
 */
function generateCacheKey(entry){
    if(entry.loc_x && entry.loc_y && entry.floor && entry.parameter && entry.value){
        return `${entry.loc_x}-${entry.loc_y}-${entry.floor}-${entry.parameter}`
   }
  throw new Error('1 or more fields are missing in: \n' + JSON.stringify(entry))

}

/**
 * Return array of all sensors on the given floor number
 * @author Lars
 * @param {floor} floor
 */
function sensorTemperaturesFromFloor(floor){
    var returnValue = []
    for(const element in sensors){
        if (sensors[element].parameter == 'temperature' && sensors[element].floor == floor){
            returnValue.push(sensors[element])
        }
    }
    return returnValue
}
