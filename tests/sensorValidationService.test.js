jest.mock('../services/influxDbPersistanceService')
jest.mock('@influxdata/influxdb-client')

const SensorFault = require('../models/SensorFault')
const {getSensorEntries} = require('../services/influxDbPersistanceService')
const sensorValidationService = require('../services/sensorValidationService')
const service = require('../services/sensorValidationService')
const sensorCachingService = require('../services/sensorCachingService')

let sampleInvalidEntry

beforeAll(() =>{
    sampleInvalidEntry ={
        loc_x: 10,
        loc_y: 10,
        fault_code: 'ERROR_TEMPERATURE_OUT_OF_RANGE',
        floor: 11,
        parameter:'temperature',
        value: null
    }
})

test('exists', () =>{
    expect(service.reportFaultyMeasurement).toBeTruthy()
})

test('Report first faulty entry results in true', async () => {

    getSensorEntries.mockResolvedValue([])

    expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBeTruthy()
})

test('one faulty entry + more valid entries results in true', async () => {

    getSensorEntries.mockResolvedValue([
        {is_valid: 'true'},
        {is_valid: 'true'},
        {is_valid: 'true'},
        {is_valid: 'true'},
    ])

    expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBeTruthy()
})

test('The correct coordinates are being requested', async () => {

    getSensorEntries.mockResolvedValue([])

    await service.reportFaultyMeasurement({
        loc_x: 1,
        loc_y: 2,
        floor: 11,
        value: 25,
        paramaeter: 'temperature',
    })

    const requestedLoc = getSensorEntries.mock.calls[0][0]

    expect(requestedLoc.loc_x).toBe(1)
    expect(requestedLoc.loc_y).toBe(2)
    expect(requestedLoc.floor).toBe(11)
})

test('Report second faulty entry results in false', async () => {

    getSensorEntries.mockResolvedValue([
        {is_valid: 'false'}
    ])

    expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBeFalsy()
})

describe('Tests when uptime of server is > 5min', () => {
    beforeEach( () => {
        jest.spyOn(process, 'uptime').mockImplementation(() => 6 * 60 * 1e9) // 6 minutes
    })

    test('Report first faulty entry results in false', async () => {

        getSensorEntries.mockResolvedValue([])

        expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBe(false)
    })

    test('one faulty entry + four valid entries results in false', async () => {

        getSensorEntries.mockResolvedValue([
            {is_valid: 'true'},
            {is_valid: 'true'},
            {is_valid: 'true'},
            {is_valid: 'true'},
        ])

        expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBe(false)
    })

    test('one faulty entry + 18 valid entries results in false', async () => {

        getSensorEntries.mockResolvedValue(new Array(18).fill({is_valid: 'true'}))

        expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBe(false)
    })

    test('one faulty entry + 19 valid entries results in true', async () => {

        getSensorEntries.mockResolvedValue(new Array(19).fill({is_valid: 'true'}))

        expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBe(true)
    })

    test('one faulty entry + 20 valid entries results in true', async () => {

        getSensorEntries.mockResolvedValue(new Array(20).fill({is_valid: 'true'}))

        expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBe(true)
    })

    test('one faulty entry + 18 valid + 1 invalid results in false', async () => {

        const EntryCacheMock = new Array(19).fill({is_valid: 'true'})
        EntryCacheMock.push({is_valid: false})

        getSensorEntries.mockResolvedValue(EntryCacheMock)

        expect(await service.reportFaultyMeasurement(sampleInvalidEntry)).toBe(false)
    })
})

test('test fault code for temperature > 45',() => {

    let counter = {
        true: 19,
        false: 0
    }
    entry = {
        loc_x: 10,
        loc_y: 15,
        floor: 3,
        value: 8,
        parameter: "temperature"
    }

    service.reasonForFaulty(entry, counter)

        expect(entry.fault_code).toEqual('ERROR_TEMPERATURE_OUT_OF_RANGE')
    })

    test('test fault code for temperature < 15', () => {
let counter = {
    true: 19,
    false: 0
}
    entry = {
        loc_x: 10,
        loc_y: 15,
        floor: 3,
        value: 55,
        parameter: "temperature"
    }

    service.reasonForFaulty(entry, counter)

        expect(entry.fault_code).toEqual('ERROR_TEMPERATURE_OUT_OF_RANGE')
    })

    test('test fault code for temperature between 45>x>15',  () => {
        let counter = {
            true: 19,
            false: 0
        }
        entry = {
            loc_x: 10,
            loc_y: 15,
            floor: 3,
            value: 35,
            parameter: "temperature"
        }

        service.reasonForFaulty(entry, counter)

        expect(entry.fault_code).toEqual(undefined)
    })

    test('test fault code for enough valid entries',() => {

        let counter = {
            true:19,
            false: 0
        }
        entry = {
            loc_x: 10,
            loc_y: 15,
            floor: 3,
            value:28,
            parameter: "temperature"
        }
         service.reasonForFaulty(entry, counter)
       expect(entry.fault_code).toEqual(undefined)

    })

    test('test fault code for not enough valid entries',() => {

        let counter = {
            true: 18,
            false: 0
        }
        entry = {
            loc_x: 10,
            loc_y: 15,
            floor: 3,
            value: 28,
            parameter: "temperature"
        }
        service.reasonForFaulty(entry, counter)
        expect(entry.fault_code).toEqual('ERROR_NOT_ENOUGH_VALID_ENTRIES')

    })

    test('test fault code for temp difference more than 2 than previous measurement', async () => {

        let counter = {
            true: 19,
            false: 0
        }
        entry = {
            loc_x: 10,
            loc_y: 15,
            floor: 3,
            value: 22,
            parameter: "temperature"
        }

        new_entry = {
            loc_x: 10,
            loc_y: 15,
            floor: 3,
            value: 30,
            parameter: "temperature"
        }
        sensorCachingService.storeCurrentValue(entry)
        service.reasonForFaulty(new_entry, counter)
        expect(new_entry.fault_code).toEqual('ERROR_TEMPERATURE_DIFFERENCE_MORE_THAN_2_CELSIUS')

    })

