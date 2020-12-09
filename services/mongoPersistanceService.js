/**
 * This service encapsulates the interaction with the MongoDb Database 
 * and exposes methods that deal with domain-specific models.
 * 
 * @author Mihail Bondarenco 
 */

const mongoose = require('mongoose');
const SensorFault = require('../models/SensorFault');

const {MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, MONGO_URL} = process.env

// if MONGO_URL is truthy then we're testing and there's no need to create another connection 
if(mongoose.connection.readyState === 0 && !MONGO_URL){
    console.log('loading mongo from service');
    mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@kozi-main.o5ow5.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log('MongoDb connected'));
}
   

/**
 * Registers to mongo that a sensor has faulted. Uses *SensorFault* model for that
 * @param {Measurement} measurement the measuremnt that represents a faulty sensor, only it's location is being extracted
 * @returns a promise that resolves to the object saved in the db
 */
async function saveFaultySensor(measurement){
    const entry = new SensorFault(measurement)
    return await entry.save()
}

module.exports = {saveFaultySensor}