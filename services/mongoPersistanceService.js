const mongoose = require('mongoose');

const {MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB} = process.env

mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@kozi-main.o5ow5.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true});

const sensorFaultSchema = new mongoose.Schema({
    loc_x: Number,
    loc_y: Number,
    floor: Number,
    timestamp: { type: Date, default: Date.now }
});

const SensorFault = mongoose.model('SensorFault', sensorFaultSchema);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('MongoDb connected')
    
    SensorFault.find((e,r) => console.log(e || r))

});

module.exports = {SensorFault}

