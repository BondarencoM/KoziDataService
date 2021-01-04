const { Schema, model } = require('mongoose')

const sensorMaintenanceSchema = Schema({
    loc_x: Number,
    loc_y: Number,
    floor: Number,
})


const SensorMaintenance = model('SensorMaintenance', sensorMaintenanceSchema, 'sensor_maintenance')

module.exports = SensorMaintenance
