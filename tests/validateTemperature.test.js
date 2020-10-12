const { validateTemperature } = require("../services/validateService");
const validateService = require("../services/validateService");

beforeEach(() => {
  entry ={
    loc_x: 10,
    loc_y: 15,
    value: null,
    parameter: "temperature"
}
});


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