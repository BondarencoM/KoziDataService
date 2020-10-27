const {
    validateTemperature,
    validateTemperatureWithLastEntry,
    validateEntry
} = require("../services/entryvalidateService");
const sensorCachingService = require("../services/sensorCachingService");

beforeEach(() => {
    entry = {
        loc_x: 10,
        loc_y: 15,
        floor: 3,
        value: null,
        parameter: "temperature"
    }

    oldentry = {
        loc_x: 10,
        loc_y: 15,
        floor: 3,
        value: null,
        parameter: "temperature"
    }
});

// Checks the method of validateTemperature
test('Checks the temperature for 15<x<45', () => {
    entry.value = 24;
    expect(validateTemperature(entry)).toBe(true);
});

test('Checks the temperature for x > 45', () => {
    entry.value = 65;
    expect(validateTemperature(entry)).toBe(false);
});

test('Checks the temperature for x < 15', () => {
    entry.value = 11;
    expect(validateTemperature(entry)).toBe(false);
});


test('Checks the temperature null', () => {
    entry.value = null;;
    expect(validateTemperature(entry)).toBe(false);
});

test('Checks the temperature undefined', () => {
    entry.value = undefined;
    expect(validateTemperature(entry)).toBe(false);
});


// Checking Humidity Field -> which is not affected by the value because we only testing temperature value
test('Checks the humidity for x < 15', () => {
    entry.value = 11;
    entry.parameter = "humidity";
    expect(validateTemperature(entry)).toBe(true);
});

test('Checks the humidity for x > 45', () => {
    entry.value = 65;
    entry.parameter = "humidity";
    expect(validateTemperature(entry)).toBe(true);
});

test('Checks the humidity for 15<x<45', () => {
    entry.value = 24;
    entry.parameter = "humidity";
    expect(validateTemperature(entry)).toBe(true);
});

test('Checks the humidity for null', () => {
    entry.value = null;
    entry.parameter = "humidity";
    expect(validateTemperature(entry)).toBe(true);
});

test('Checks the humidity for undefined', () => {
    entry.value = undefined;
    entry.parameter = "humidity";
    expect(validateTemperature(entry)).toBe(true);
});

// Checks the method of validateTemperatureWithLastEntry
test('Checks if the temperature has risen or fallen more than 2 degrees since last measurement- Checks if absolute difference > 2 and the parameter is temperature', () => {
    entry.value = 25;
    oldentry.value = 35;
    sensorCachingService.storeCurrentValue(oldentry);
    expect(validateTemperatureWithLastEntry(entry)).toBe(false);
});

test('Checks if the temperature has risen or fallen more than 2 degrees since last measurement- Checks if absolute difference < 2 and the parameter is temperature', () => {
    entry.value = 25;
    oldentry.value = 26;
    sensorCachingService.storeCurrentValue(oldentry);
    expect(validateTemperatureWithLastEntry(entry)).toBe(true);
});

test('Checks if the temperature has risen or fallen more than 2 degrees since last measurement- Checks if absolute difference > 2 and the parameter is humidity', () => {
    entry.value = 25;
    entry.parameter = 'humidity'
    oldentry.value = 35;
    oldentry.parameter = 'humidity'
    sensorCachingService.storeCurrentValue(oldentry);
    expect(validateTemperatureWithLastEntry(entry)).toBe(true);
});

test('Checks if the temperature has risen or fallen more than 2 degrees since last measurement- Checks if absolute difference < 2 and the parameter is humidity', () => {
    entry.value = 25;
    entry.parameter = 'humidity'
    oldentry.value = 26;
    oldentry.parameter = 'humidity'
    sensorCachingService.storeCurrentValue(oldentry);
    expect(validateTemperatureWithLastEntry(entry)).toBe(true);
});



// Checks the method of validateTemperatureWithHighestandLowest -- Deleted for now
// test('Checks if the temperature is not 3 degrees higher than the highest valid entry.', () => {

//     createSomeFakeData(1, 2, 3, 20, 'temperature')
//     createSomeFakeData(1, 3, 3, 21, 'temperature')
//     createSomeFakeData(1, 4, 3, 22, 'temperature')
//     createSomeFakeData(1, 5, 3, 23, 'temperature')
//     createSomeFakeData(1, 6, 3, 24, 'temperature')
//     createSomeFakeData(1, 7, 3, 25, 'temperature')
//     entry.value = 20

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(true);

// });

// test('Checks if the temperature is 3 degrees higher than the highest valid entry.', () => {

//     createSomeFakeData(1, 2, 3, 20, 'temperature')
//     createSomeFakeData(1, 3, 3, 21, 'temperature')
//     createSomeFakeData(1, 4, 3, 22, 'temperature')
//     createSomeFakeData(1, 5, 3, 23, 'temperature')
//     createSomeFakeData(1, 6, 3, 24, 'temperature')
//     createSomeFakeData(1, 7, 3, 25, 'temperature')
//     entry.value = 35

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(false);

// });


// test('Checks if the temperature is 3 degrees lower than the lowest entry.', () => {

//     createSomeFakeData(1, 2, 3, 20, 'temperature')
//     createSomeFakeData(1, 3, 3, 21, 'temperature')
//     createSomeFakeData(1, 4, 3, 22, 'temperature')
//     createSomeFakeData(1, 5, 3, 23, 'temperature')
//     createSomeFakeData(1, 6, 3, 24, 'temperature')
//     createSomeFakeData(1, 7, 3, 25, 'temperature')
//     entry.value = 15

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(false);

// });

// test('Checks if the temperature is not 3 degrees lower than the lowest entry.', () => {

//     createSomeFakeData(1, 2, 3, 20, 'temperature')
//     createSomeFakeData(1, 3, 3, 21, 'temperature')
//     createSomeFakeData(1, 4, 3, 22, 'temperature')
//     createSomeFakeData(1, 5, 3, 23, 'temperature')
//     createSomeFakeData(1, 6, 3, 24, 'temperature')
//     createSomeFakeData(1, 7, 3, 25, 'temperature')
//     entry.value = 18

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(true);

// });


// test('Checks if the temperature is not 3 degrees higher than the highest valid entry. mixed with humidity', () => {

//     createSomeFakeData(2, 2, 4, 20, 'humidity')
//     createSomeFakeData(2, 3, 4, 21, 'humidity')
//     createSomeFakeData(2, 4, 4, 22, 'temperature')
//     createSomeFakeData(2, 5, 4, 23, 'temperature')
//     createSomeFakeData(2, 6, 4, 24, 'temperature')
//     createSomeFakeData(2, 7, 4, 25, 'humidity')
//     entry.floor = 4
//     entry.value = 27

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(true);

// });

// test('Checks if the temperature is 3 degrees higher than the highest valid entry. mixed with humidity', () => {

//     createSomeFakeData(2, 2, 4, 20, 'humidity')
//     createSomeFakeData(2, 3, 4, 21, 'humidity')
//     createSomeFakeData(2, 4, 4, 22, 'temperature')
//     createSomeFakeData(2, 5, 4, 23, 'temperature')
//     createSomeFakeData(2, 6, 4, 24, 'temperature')
//     createSomeFakeData(2, 7, 4, 25, 'humidity')
//     entry.floor = 4
//     entry.value = 28

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(false);

// });

// test('Checks if the temperature is not 3 degrees lower than the lowest entry. mixed with humidity', () => {

//     createSomeFakeData(2, 2, 4, 20, 'humidity')
//     createSomeFakeData(2, 3, 4, 21, 'humidity')
//     createSomeFakeData(2, 4, 4, 22, 'temperature')
//     createSomeFakeData(2, 5, 4, 23, 'temperature')
//     createSomeFakeData(2, 6, 4, 24, 'temperature')
//     createSomeFakeData(2, 7, 4, 25, 'humidity')
//     entry.floor = 4
//     entry.value = 19

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(true);

// });

// test('Checks if the temperature is not 3 degrees lower than the lowest entry. mixed with humidity', () => {

//     createSomeFakeData(2, 2, 4, 20, 'humidity')
//     createSomeFakeData(2, 3, 4, 21, 'humidity')
//     createSomeFakeData(2, 4, 4, 22, 'temperature')
//     createSomeFakeData(2, 5, 4, 23, 'temperature')
//     createSomeFakeData(2, 6, 4, 24, 'temperature')
//     createSomeFakeData(2, 7, 4, 25, 'humidity')
//     entry.floor = 4
//     entry.value = 18

//     expect(validateTemperatureWithHighestandLowest(entry)).toBe(false);

// });

// Checks for the method of validateEntry
test('Validates the entry with correct values', () => {

    createSomeFakeData(11, 11, 5, 20, 'humidity')
    createSomeFakeData(11, 12, 5, 21, 'humidity')
    createSomeFakeData(11, 13, 5, 22, 'temperature')
    createSomeFakeData(11, 14, 5, 23, 'temperature')
    createSomeFakeData(11, 15, 5, 24, 'temperature')
    createSomeFakeData(11, 16, 5, 25, 'humidity')


    newentry = {
        loc_x: 11,
        loc_y: 15,
        floor: 5,
        value: 25,
        parameter: "temperature"
    }

    expect(validateEntry(newentry)).toBe(true);

});

test('Validates the entry with wrong last value', () => {

    createSomeFakeData(11, 11, 5, 20, 'humidity')
    createSomeFakeData(11, 12, 5, 21, 'humidity')
    createSomeFakeData(11, 13, 5, 22, 'temperature')
    createSomeFakeData(11, 14, 5, 23, 'temperature')
    createSomeFakeData(11, 15, 5, 24, 'temperature')
    createSomeFakeData(11, 16, 5, 25, 'humidity')


    newentry = {
        loc_x: 11,
        loc_y: 15,
        floor: 5,
        value: 27,
        parameter: "temperature"
    }

    expect(validateEntry(newentry)).toBe(false);

});

//Deleted for now
// test('Validates the entry -> value exceeds highest temperature', () => {

//     createSomeFakeData(11, 11, 5, 20, 'humidity')
//     createSomeFakeData(11, 12, 5, 21, 'humidity')
//     createSomeFakeData(11, 13, 5, 22, 'temperature')
//     createSomeFakeData(11, 14, 5, 23, 'temperature')
//     createSomeFakeData(11, 15, 5, 24, 'temperature')
//     createSomeFakeData(11, 16, 5, 25, 'humidity')


//     newentry = {
//         loc_x: 14,
//         loc_y: 15,
//         floor: 5,
//         value: 28,
//         parameter: "temperature"
//     }

//     expect(validateEntry(newentry)).toBe(false);

// });

//Deleted for now
// test('Validates the entry -> value is lower than the lowest', () => {

//     createSomeFakeData(12, 11, 5, 20, 'humidity')
//     createSomeFakeData(12, 12, 5, 21, 'humidity')
//     createSomeFakeData(12, 13, 5, 22, 'temperature')
//     createSomeFakeData(12, 14, 5, 23, 'temperature')
//     createSomeFakeData(12, 15, 5, 24, 'temperature')
//     createSomeFakeData(12, 16, 5, 25, 'humidity')


//     newentry = {
//         loc_x: 17,
//         loc_y: 15,
//         floor: 5,
//         value: 18,
//         parameter: "temperature"
//     }

//     expect(validateEntry(newentry)).toBe(false);

// });

test('Validates the entry with wrong temperature value = 105', () => {

    createSomeFakeData(11, 11, 5, 100, 'humidity')
    createSomeFakeData(11, 12, 5, 101, 'humidity')
    createSomeFakeData(11, 13, 5, 102, 'temperature')
    createSomeFakeData(11, 14, 5, 103, 'temperature')
    createSomeFakeData(11, 15, 5, 104, 'temperature')
    createSomeFakeData(11, 16, 5, 105, 'humidity')


    newentry = {
        loc_x: 11,
        loc_y: 15,
        floor: 5,
        value: 105,
        parameter: "temperature"
    }

    expect(validateEntry(newentry)).toBe(false);

});


function createSomeFakeData(loc_x, loc_y, floor, value, parameter) {
    const differentEntry = {
        loc_x: loc_x,
        loc_y: loc_y,
        floor: floor,
        value: value,
        parameter: parameter,
    }
    sensorCachingService.storeCurrentValue(differentEntry)
}
