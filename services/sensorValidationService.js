const { getSensorEntries } = require('./influxDbPersistanceService')

/**
 * Acknowledges a faulty entry and returns false if the associated sensor should be considered faulty otherwise true
 * @param {{loc_x: number, loc_y: number, floor: number}} measurement the measuremnt that is considered falses
 * @returns false if associated sensor is considered faulty and true otherwise
 */
async function reportFaultyMeasurement(measurement){
    let entries = await getSensorEntries(measurement, '-5m', '0m')

    let counter = { true: 0, false: 0} 
    entries.forEach(entry => counter[entry.is_valid]++)

    if( tooManyInvalidEntries(counter) || notEnoughValidEntries(counter)){
        console.log("Sensor Invalid!")
        console.log(Date().toString())
        console.log({measurement, counter})
        return false
    }

    return true
}

function tooManyInvalidEntries(counter){ return counter.false > 0 }

const MIN_ENTRIES_PER_5_MINUTES = 19 // temperature and hummidity, twice a minute, five minutes, one wrong is okay

function notEnoughValidEntries(counter){ 
    return counter.true < MIN_ENTRIES_PER_5_MINUTES && IsServerUpFor5Minutes()
}

// 5 minutes = 5 min * 60 sec * 10^9 nanosec
function IsServerUpFor5Minutes(){ return process.uptime() > 5 * 60 * 1e+9}

module.exports = {reportFaultyMeasurement}