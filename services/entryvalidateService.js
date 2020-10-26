const sensorCachingService = require('./sensorCachingService');

/**
 * Checks the validation of the entry
 * @author Onur Ereren
 * @param {Sensor Object} entry
 * @returns {boolean} Returns true if the entry is correct otherwise false.
 */
function validateEntry(entry) {
    return validateTemperature(entry) && validateTemperatureWithLastEntry(entry)
}

/**
 * Checks the temperature of the entry.
 * @author Onur Ereren
 * @param {Sensor Object} entry
 * @returns {boolean} Returns true if the entry is correct otherwise false.
 */
function validateTemperature(entry) {
    if (entry.parameter == 'temperature') {
        if (!(entry.value > 15 && entry.value < 45)) {
            return false;
        }
    }
    return true;
}

/**
 * Checks the current and the last temperature
 * @author Onur Ereren
 * @param {Sensor Object} entry
 * @returns {boolean} Returns true if the entry is correct otherwise false.
 */
function validateTemperatureWithLastEntry(entry) {
    if (entry.parameter == 'temperature') {
        let oldTemp = sensorCachingService.retrieveLastValue(entry);
        if (oldTemp != null) {
            if (Math.abs(entry.value - oldTemp) > 2) {
                return false;
            }
        }
    }
    return true;
}

//Removed this fucntion for now
// /**
//  * Checks if the temperature is 3 degrees higher than the highest valid entry or 3 degrees lower than the lowest.
//  * @author Onur Ereren
//  * @param {Sensor Object} entry
//  * @returns {boolean} Returns true if the entry is correct otherwise false.
//  */
// function validateTemperatureWithHighestandLowest(entry) {
//     if (entry.parameter == 'temperature') {
//         let maxTemp = sensorCachingService.getMaxTemp(entry.floor);
//         let minTemp = sensorCachingService.getMinTemp(entry.floor);
//         if ((Math.abs(entry.value - maxTemp) > 3 && Math.sign(entry.value - maxTemp) == 1) || Math.abs(entry.value - minTemp) > 3 && Math.sign(entry.value - minTemp) == -1) {
//             return false;
//         }
//     }
//     return true;
// }

module.exports = {
    validateTemperature,
    validateTemperatureWithLastEntry,
    validateEntry
}
