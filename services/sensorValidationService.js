const { getSensorEntries } = require('./influxDbPersistanceService')
const {
    validateTemperature,
    validateTemperatureWithLastEntry,
} = require("../services/entryvalidateService");
const fault_codes = require('../utils/constants');
const sensorCachingService = require('./sensorCachingService');
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
        reasonForFaulty(measurement,counter)
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

/**
 * @description Storing inforamtion about why sensor is faulty
 * @author Onur Ereren
 * @param {Sensor Object} entry
 * @returns {Sensor Object} based on fault
 */
function reasonForFaulty(entry,counter) {
    if (entry.parameter == 'temperature') {
        if (validateTemperature(entry) == false) {
            entry.fault_code = fault_codes.temp_out_of_range
            return entry
        } else if (validateTemperatureWithLastEntry(entry) == false) {
            entry.fault_code = fault_codes.temp_difference_more_than_2
            return entry
        }
        else if (notEnoughValidEntries(counter)) {
            entry.fault_code = fault_codes.not_enough_valid_entries
            return entry
        }
    }
}

module.exports = {reportFaultyMeasurement,reasonForFaulty}