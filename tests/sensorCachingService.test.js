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
    expect(() => {
        dataProcessing.storeCurrentValue(entry)
    }).not.toThrow(new Error())
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

test('BUGFIX - highest temprature function should not return a humidity value', () =>{
    createSomeFakeData(1,2,2,20.1, 'temprature')
    createSomeFakeData(2,2,2,25.6, 'humidity')
    createSomeFakeData(4,5,2,18.5, 'humidity')
    createSomeFakeData(7,5,2,25.5, 'temprature')
    expect(dataProcessing.getMaxTemp(2)).toBe(25.5)
})

test('BUGFIX - lowest temprature function should not return a humidity value', () =>{
    createSomeFakeData(1,2,2,20.1, 'temprature')
    createSomeFakeData(2,2,2,25.6, 'humidity')
    createSomeFakeData(4,5,2,18.5, 'humidity')
    createSomeFakeData(7,5,2,25.5, 'temprature')
    expect(dataProcessing.getMinTemp(2)).toBe(20.1)
})

function createSomeFakeData(loc_x, loc_y, floor, value, parameter){
    const differentEntry = {
        loc_x : loc_x,
        loc_y : loc_y,
        floor : floor,
        value : value,
        parameter : parameter,
    }
    dataProcessing.storeCurrentValue(differentEntry)
}

function sendSomeFakeData(){
    createSomeFakeData(1,2,3,20.1, 'temprature')
    createSomeFakeData(2,2,3,25.6, 'temprature')
    createSomeFakeData(4,5,3,18.5, 'temprature')
    createSomeFakeData(7,5,3,25.5, 'temprature')
    createSomeFakeData(1,2,4,26.9, 'temprature')
    createSomeFakeData(6,9,4,16.4, 'temprature')
}
