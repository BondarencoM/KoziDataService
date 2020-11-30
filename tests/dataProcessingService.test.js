jest.mock('../services/influxDbPersistanceService')
jest.mock('../services/entryvalidateService')
jest.mock('../services/sensorCachingService')
jest.mock('../services/sensorValidationService')
jest.mock('../services/mongoPersistanceService.js')
jest.mock('@influxdata/influxdb-client')

const service = require('../services/dataProcessingService');

const {validateEntry} = require('../services/entryvalidateService')
const {reportFaultyMeasurement,reasonForFaulty} = require('../services/sensorValidationService')
const {saveMeasurement} = require('../services/influxDbPersistanceService')
const {storeCurrentValue} = require('../services/sensorCachingService')
const {saveFaultySensor} = require('../services/mongoPersistanceService.js')


let sampleTopic;

beforeAll(()=>{
    sampleTopic = generateTopic({
        floor: 11,
        x: 5,
        y: 10,
        param: 'temperature',
    })
})

test('exists', () =>{
    expect(service.processSensorMessage).toBeTruthy()
})

test('Processing valid entry', ()=>{

    let expectedMeasurement = {
        floor: '11',
        loc_x: '5',
        loc_y: '10',
        parameter: 'temperature',
        value: 30,
        is_valid: true,
    }

    validateEntry.mockReturnValueOnce(true);

    service.processSensorMessage(sampleTopic, 30)

    expect(validateEntry).toHaveBeenCalledWith(expectedMeasurement)
    expect(storeCurrentValue).toHaveBeenCalledWith(expectedMeasurement)
    expect(reportFaultyMeasurement.mock.calls.length).toBe(0)
    expect(saveMeasurement).toHaveBeenCalledWith(expectedMeasurement)
    expect(saveFaultySensor.mock.calls.length).toBe(0)
})

test('Ignore invalid topics', ()=>{

    let invalidTopcis = [
        null,
        undefined,
        '',
        '  ',
        'foo',
        'humtemp',
        'humtemp/11',
        'humtemp/11/5',
        'humtemp/11/5/10',
        'humtemp/11/5/10/sensor/',
        'humtemp/11/5/10/sensor/temperature',
        'humtemp/11/5/10/sensor/temperature/',
        'humtemp/11/5/10/sensor/humidity',
        'humtemp/11/5/10/sensor/humidity/',
        'humtemp/11/5/10/sensor/hum/state',
        'humtemp/11/5/10/sensor/temp/state',
        'humtemp/5/10/sensor/temperature/state',
        'humtemp/5/10/sensor/humidity/state',
        'humtemp//5/10/sensor/humidity/state',
        'humtemp/11//10/sensor/humidity/state',
        'humtemp/11/5//sensor/humidity/state',
        'humtemp/eleven/5/10/sensor/temperature/state',
        'humtemp/11/five/10/sensor/temperature/state',
        'humtemp/11/5/ten/sensor/temperature/state',
        'humtemp/-11/5/10/sensor/temperature/state',
        'humtemp/11/-5/10/sensor/temperature/state',
        'humtemp/11/5/-10/sensor/temperature/state',
        'humtemp/11.5/5/-10/sensor/temperature/state',

    ]

    for (topic of invalidTopcis){
        service.processSensorMessage(topic, 30)
    }

    expect(validateEntry.mock.calls.length).toBe(0)
    expect(storeCurrentValue.mock.calls.length).toBe(0)
    expect(reportFaultyMeasurement.mock.calls.length).toBe(0)
    expect(saveMeasurement.mock.calls.length).toBe(0)

})

test('Processing invalid entry', async ()=> {

    let expectedMeasurement = {
        floor: '11',
        loc_x: '5',
        loc_y: '10',
        parameter: 'temperature',
        value: 300,
        is_valid: false,
    }

    validateEntry.mockReturnValueOnce(false)
    reportFaultyMeasurement.mockReturnValueOnce(false)
    await service.processSensorMessage(sampleTopic, 300)

    expect(validateEntry).toHaveBeenCalledWith(expectedMeasurement)
    expect(storeCurrentValue.mock.calls.length).toBe(0)
    expect(reportFaultyMeasurement).toHaveBeenCalledWith(expectedMeasurement)
    expect(saveFaultySensor).toHaveBeenCalledWith(expectedMeasurement)
    expect(saveMeasurement).toHaveBeenCalledWith(expectedMeasurement)
})

function generateTopic({floor, x, y, param}){
    return `humtemp/${floor}/${x}/${y}/sensor/${param}/state`
}
