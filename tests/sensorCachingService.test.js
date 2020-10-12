let dataProcessing
let entry
beforeEach(() => {
    dataProcessing = require('../services/sensorCachingService')
     entry = {
        loc_x : 1,
        loc_y : 1,
        floor : 3,
        value : 25.6,
        parameter : 'temprature',
    }
})

test('Retrieve a non existing value', () => {
    expect(dataProcessing.retrieveLastValue(entry)).toBe(null)
})

test('Store a new value', ()=>{
    dataProcessing.storeCurrentValue(entry)
})

test('Retrieve an existing value', () =>{
    dataProcessing.storeCurrentValue(entry)
    expect(dataProcessing.retrieveLastValue(entry)).toBe(25.6)
})

test('Invalid argument should throw exeption', () => {
    delete entry.floor
    expect(() =>{
        dataProcessing.retrieveLastValue(entry)
    }).toThrow(new Error('1 or more fields are missing'))
})

test('Retrieve the max temprature of floor 3', () => {
    sendSomeFakeData()
    expect(dataProcessing.getMaxTemp(3)).toBe(25.6)
})

test('Retrieve the min temprature of floor 3', () => {
    sendSomeFakeData()
    expect(dataProcessing.getMinTemp(3)).toBe(18.5)
})

function createSomeFakeData(loc_x, loc_y, floor, value){
    const entry = {
        loc_x : loc_x,
        loc_y : loc_y,
        floor : floor,
        value : value,
        parameter : 'temprature',
    }
    dataProcessing.storeCurrentValue(entry)
}

function sendSomeFakeData(){
    createSomeFakeData(1,2,3,20.1)
    createSomeFakeData(2,2,3,25.6)
    createSomeFakeData(4,5,3,18.5)
    createSomeFakeData(7,5,3,25.5)
    createSomeFakeData(1,2,4,26.9)
    createSomeFakeData(6,9,4,16.4)
}
