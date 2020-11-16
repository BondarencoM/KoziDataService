let dataProcessing
let entry
beforeEach(() => {
    dataProcessing = require('../services/sensorCachingService')
    entry = {
        loc_x : 1,
        loc_y : 1,
        floor : 3,
        value : 25.6,
        parameter : 'temperature',
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
    }).toThrow(/1 or more fields are missing/)
})

//Deleted for now
// test('Retrieve the max temperature of floor 3', () => {
//     sendSomeFakeData()
//     expect(dataProcessing.getMaxTemp(3)).toBe(25.6)
// })

// test('Retrieve the min temperature of floor 3', () => {
//     sendSomeFakeData()
//     expect(dataProcessing.getMinTemp(3)).toBe(18.5)
// })

//Deleted for now
// test('BUGFIX - highest temperature function should not return a humidity value', () =>{
//     createSomeFakeData(1,2,2,20.1, 'temperature')
//     createSomeFakeData(2,2,2,25.6, 'humidity')
//     createSomeFakeData(4,5,2,18.5, 'humidity')
//     createSomeFakeData(7,5,2,25.5, 'temperature')
//     expect(dataProcessing.getMaxTemp(2)).toBe(25.5)
// })

// test('BUGFIX - lowest temperature function should not return a humidity value', () =>{
//     createSomeFakeData(1,2,2,20.1, 'temperature')
//     createSomeFakeData(2,2,2,25.6, 'humidity')
//     createSomeFakeData(4,5,2,18.5, 'humidity')
//     createSomeFakeData(7,5,2,25.5, 'temperature')
//     expect(dataProcessing.getMinTemp(2)).toBe(20.1)
// })

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
    createSomeFakeData(1,2,3,20.1, 'temperature')
    createSomeFakeData(2,2,3,25.6, 'temperature')
    createSomeFakeData(4,5,3,18.5, 'temperature')
    createSomeFakeData(7,5,3,25.5, 'temperature')
    createSomeFakeData(1,2,4,26.9, 'temperature')
    createSomeFakeData(6,9,4,16.4, 'temperature')
}
