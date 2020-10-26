jest.mock('../services/influxDbPersistanceService')
jest.mock('@influxdata/influxdb-client')

const {getSensorEntries} = require('../services/influxDbPersistanceService')

const service = require('../services/sensorValidationService')


let sampleInvalidEntry

beforeAll(() =>{
    sampleInvalidEntry ={
        loc_x: 10,
        loc_y: 10,
        floor: 11,
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
