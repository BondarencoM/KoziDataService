
//Checks temperature value of the entry
function validateTemperature(fieldName, tempValue, is_valid) {
    if (fieldName == 'temperature') {
        //if temperature is not between 15<x<45 then return false
        if (!(tempValue > 15 && tempValue < 45)) {
            return false;
        }
    }
 
    return true;
}



module.exports = {
    validateTemperature,
 
}
