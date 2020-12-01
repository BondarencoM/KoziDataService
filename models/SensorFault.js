const {Schema, model} = require('mongoose')

const sensorFaultSchema = new Schema({
    loc_x: {
        type: Number,
        min: 0,
        required: true
    },
    loc_y: {
        type: Number,
        min: 0,
        required: true
    },
    floor: {
        type: Number,
        min: 0,
        required: true
    },
    fault_code: {
        type: String,
        required: true
    },
    timestamp: { 
        type: Date, 
        default: Date.now, 
        required: true
    }
});

const SensorFault = model('SensorFault', sensorFaultSchema)

module.exports = SensorFault
