const persistantDb = require('./mongoPersistanceService')
let maintenanceSensors = []

// Fetches and stores locally the maintenance sensors
async function getSensorsInMaintenance() {
    maintenanceSensors = await persistantDb.getSensorsInMaintenance()
}

// Fetches all maintenance sensors from mongo every 30 seconds
setInterval(function () {
    getSensorsInMaintenance()
}, 30000)


// Checks if the given entry has the same geocoordinates as a sensor in maintenance mode
async function isEntryInMaintenance(entry) {
    if (maintenanceSensors == undefined || maintenanceSensors.length == 0) return false

    var things = maintenanceSensors.filter(function (item) {
        return item.floor == entry.floor && item.loc_x == entry.loc_x && item.loc_y == entry.loc_y
    })

    if (things == undefined || things.length == 0) {
        return false
    }
    else {
        return true
    }
}

module.exports = { isEntryInMaintenance }
