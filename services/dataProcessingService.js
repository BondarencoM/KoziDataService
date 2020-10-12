let dbService = require('./influxDbPersistanceService')
const validationService = require('./entryvalidateService')
const cacheService = require('./sensorCachingService')

async function processSensorMessage(topic, message){
    // matches the topic format:
    // humtemp/<floor>/<loc_x>/<loc_y>/sensor/[humidity|temperature]/state
    // using named capturing groups
    let match = /^humtemp\/(?<floor>\d+)\/(?<loc_x>\d+)\/(?<loc_y>\d+)\/sensor\/(?<parameter>humidity|temperature)\/state$/gm.exec(topic)

    // return if we have a topic with a different format
    if(!match) return

    // extract the information out of the topic through the named groups
    let measurement = match.groups
    //and add the actual value of the measurement (temperature in degrees or the hummidity)
    measurement.value = message

 
// Validation entry -> only temperature for now
 measurement.is_valid = validationService.validateTemperatureWithLastEntry(measurement)

    //Store the current value
    cacheService.storeCurrentValue(match)

    //save the measurement in the database
    await dbService.saveMeasurement(measurement)

    console.log('Saved topic: ' + topic + ' saved')
}

module.exports = {processSensorMessage}
