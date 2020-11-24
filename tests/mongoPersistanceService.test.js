const mongoose = require('mongoose')
const SensorFault = require('../models/SensorFault')
const {saveFaultySensor} = require("../services/mongoPersistanceService")

beforeAll(async () => {
    const full_url = process.env.MONGO_URL.split('/').slice(0, -1).join('/') + '/' + global.__MONGO_DB_NAME__ 
    await mongoose.connect(full_url, { useNewUrlParser: true, useCreateIndex: true, poolSize: 20 })
})

afterAll(async ()=>{
    await mongoose.connection.close()
})

beforeEach(async () => {
    for (const key in mongoose.connection.collections) {
        await mongoose.connection.collections[key].deleteMany();
    }
    entry = {
        loc_x: 10,
        loc_y: 15,
        floor: 3,
        fault_code: 'ERROR_TEMPERATURE_OUT_OF_RANGE',
        fault_value:{old_value: 5, new_value:10},
        value: null,
        parameter: "temperature"
    }
});

test('saveFaultySensor saves sensor fault', async () => {
    const actual = await saveFaultySensor(entry)
    const expected = await SensorFault.findOne({ loc_x: 10, loc_y: 15, fault_code:'ERROR_TEMPERATURE_OUT_OF_RANGE' ,fault_value:{old_value: 5, new_value:10}, floor: 3})
    const keysToCheck = ['loc_x', 'loc_y', 'floor', 'fault_code', 'fault_value' , 'timestamp', 'id']
    keysToCheck.forEach( key => expect(actual[key]).toEqual(expected[key]))
})

test('saveFaultySensor validates loc_x as required', () => {
    delete entry.loc_x
    expect(saveFaultySensor(entry)).rejects.toThrow(/validation failed.*loc_x.*is required.*/i);
})

test('saveFaultySensor validates loc_y as required', () => {
    delete entry.loc_y
    expect(saveFaultySensor(entry)).rejects.toThrow(/validation failed.*loc_y.*is required.*/i);
})

test('saveFaultySensor validates floor as required', () => {
    delete entry.floor
    return expect(saveFaultySensor(entry)).rejects.toThrow(/validation failed.*floor.*is required.*/i);
})

test('saveFaultySensor validates fault_code as required', () => {
    delete entry.fault_code
    return expect(saveFaultySensor(entry)).rejects.toThrow(/validation failed.*fault_code.*is required.*/i);
})
test('saveFaultySensor validates fault_value as required', () => {
    delete entry.fault_value
    return expect(saveFaultySensor(entry)).rejects.toThrow(/validation failed.*fault_value.*is required.*/i);
})