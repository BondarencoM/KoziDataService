
/**
 * Checks the temperature of the entry.
 * @author Onur Ereren
 * @param {Sensor Object} entry 
 * @returns {boolean} Returns true if the temperature is correct otherwise false.
 */
function validateTemperature(entry) {
    if (entry.parameter == 'temperature') {
        //if temperature is not between 15<x<45 then return false
        if (!(entry.value > 15 && entry.value < 45)) {
            return false;
        }
    }
 
    return true;
}



function validateTemperatureWithLastEntry(){

}


function validateTemperatureWithHighestandLowest(){

}



module.exports = {
    validateTemperature,
 
}
