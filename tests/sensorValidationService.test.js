jest.mock('../services/influxDbPersistanceService')
jest.mock('@influxdata/influxdb-client')

const {getSensorEntries} = require('../services/influxDbPersistanceService')

const service = require('../services/sensorValidationService')

test('exists', () =>{
    expect(service.reportFaultyMeasurement).toBeTruthy()
})

test('Report first faulty entry results in true', async () => {

    getSensorEntries.mockResolvedValue([])

    expect(await service.reportFaultyMeasurement({
        loc_x: 10,
        loc_y: 10,
        floor: 11,
    })).toBeTruthy()
})

test('one faulty entry + more valid entries results in true', async () => {

    getSensorEntries.mockResolvedValue([
        {is_valid: 'true'},
        {is_valid: 'true'},
        {is_valid: 'true'},
        {is_valid: 'true'},
    ])

    expect(await service.reportFaultyMeasurement({
        loc_x: 10,
        loc_y: 10,
        floor: 11,
    })).toBeTruthy()
})

test('The correct coordinates are being requested', async () => {

    getSensorEntries.mockResolvedValue([])

    await service.reportFaultyMeasurement({
        loc_x: 1,
        loc_y: 2,
        floor: 11,
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

    expect(await service.reportFaultyMeasurement({
        loc_x: 10,
        loc_y: 10,
        floor: 11,
    })).toBeFalsy()
})