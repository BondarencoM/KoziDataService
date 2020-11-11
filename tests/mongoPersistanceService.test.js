const mongoose = require('mongoose')
const SensorFault = require('../models/SensortFault')
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
        value: null,
        parameter: "temperature"
    }
});

test('saveFaultySensor saves sensor fault', async () => {
    const actual = await saveFaultySensor(entry)
    const expected = await SensorFault.findOne({ loc_x: 10, loc_y: 15, floor: 3})

    const keysToCheck = ['loc_x', 'loc_y', 'floor', 'timestamp', 'id']
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
