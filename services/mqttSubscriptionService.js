var mqtt = require('mqtt')
var fs = require('fs')
var path = require('path')

var KEY = fs.readFileSync(path.join(__dirname, '../certificates/client.key'))
var CERT = fs.readFileSync(path.join(__dirname, '../certificates/client.crt'))
var TRUSTED_CA_LIST = fs.readFileSync(path.join(__dirname, '../certificates/ca.crt'))


var options = {
    port: process.env.MQTT_BROKER_PORT,
    key: KEY,
    cert: CERT,
    rejectUnauthorized: false,
    // The CA list will be used to determine if server is authorized
    ca: TRUSTED_CA_LIST,
    username: process.env.MQTT_BROKER_USERNAME,
    password: process.env.MQTT_BROKER_PASSWORD,
    host: process.env.MQTT_BROKER_URL,
    protocol: process.env.MQTT_BROKER_PROTOCOL
}


var client = mqtt.connect(options)

client.on('connect', function () {
    client.subscribe('#')
    console.log('connected')
    client.on('error', (error) => console.error(error))
})

client.on('offline', function () {
    console.log('Offline')
})

client.on('error', function (err) {
    console.log(err)
})

function onAnyMQTTMessage(handler) {
    client.on('message', (topic, message) => {
        console.log('Received message: ' + topic + ' ' + message.toString())
        handler(topic, message.toString())
    })
}

module.exports = { onAnyMQTTMessage }