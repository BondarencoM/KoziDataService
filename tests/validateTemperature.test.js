const { validateTemperature } = require("../services/validateService");
const validateService = require("../services/validateService");

test('Checks the temperature for 15<x<45', () => {
    expect(validateTemperature('temperature',24)).toBe(true);
});

test('Checks the temperature for x > 45', () => {
    expect(validateTemperature('temperature', 65)).toBe(false);
});

test('Checks the temperature for x < 15', () => {
    expect(validateTemperature('temperature', 12)).toBe(false);
});


test('Checks the temperature null', () => {
    expect(validateTemperature('temperature', null)).toBe(false);
});

test('Checks the temperature undefined', () => {
    expect(validateTemperature('temperature', undefined)).toBe(false);
});


// Checking Humidity Field -> which is not affected by the value because we only testing temperature value
test('Checks the humidity for x < 15', () => {
    expect(validateTemperature('humidity', 12)).toBe(true);
});

test('Checks the humidity for x > 45', () => {
    expect(validateTemperature('humidity', 65)).toBe(true);
});

test('Checks the humidity for 15<x<45', () => {
    expect(validateTemperature('humidity', 32)).toBe(true);
});

test('Checks the humidity for null', () => {
    expect(validateTemperature('humidity', null)).toBe(true);
});

test('Checks the humidity for undefined', () => {
    expect(validateTemperature('humidity', undefined)).toBe(true);
});