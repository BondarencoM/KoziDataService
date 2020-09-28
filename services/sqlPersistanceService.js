var sql = require('mssql')

let dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
}

async function saveMeasurement(measurement){
    await sql.connect(dbConfig)
    switch (measurement.parameter){
        case 'temperature':
            await sql.query`insert into temperature_entries(measurement,floor,loc_x,loc_y) 
            values (${measurement.value}, ${measurement.floor}, ${measurement.loc_x}, ${measurement.loc_y}) `
            break;
        case 'humidity':
            await sql.query`insert into humidity_entries(measurement,floor,loc_x,loc_y) 
            values (${measurement.value}, ${measurement.floor}, ${measurement.loc_x}, ${measurement.loc_y}) `
            break;
        default:
            throw new Error(measurement.parameter + " parameter is not supported")
    }
}

module.exports = {saveMeasurement}

