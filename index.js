require('dotenv').config()
var mqtt = require('mqtt')
var sql = require('mssql')

let dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
    enableArithAbort: false, //idk what it does but it silences the warning of changing default
}

var client  = mqtt.connect(process.env.MQTT_BROKER_URL, {
    username: process.env.MQTT_BROKER_USERNAME,
    password: process.env.MQTT_BROKER_PASSWORD,
})

client.on('connect', function () {
    client.subscribe('#')
})

client.on('message', async function (topic, message_object) {
    let message = message_object.toString()
    console.log('received message: ' + topic + ' ' + message)

    // matches the topic format mihatest/<floor>/<loc_x>/<loc_y>/[humidity|temperature] and extracts named groups
    let location = /^mihatest\/(?<floor>\d+)\/(?<loc_x>\d+)\/(?<loc_y>\d+)\/(?<parameter>humidity|temperature)$/gm.exec(topic).groups

    await sql.connect(dbConfig)

    switch (location.parameter){
        case 'temperature':
            await sql.query`insert into temperature_entries(measurement,floor,loc_x,loc_y) 
            values (${message}, ${location.floor}, ${location.loc_x}, ${location.loc_y}) `
            break;
        case 'humidity':
            await sql.query`insert into humidity_entries(measurement,floor,loc_x,loc_y) 
            values (${message}, ${location.floor}, ${location.loc_x}, ${location.loc_y}) `
            break;
    }

    console.log('Topic: ' + topic + ' saved')
})