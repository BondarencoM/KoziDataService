require('dotenv').config()
var mqtt = require('mqtt')

var client  = mqtt.connect(process.env.MQTT_BROKER_URL, {
    username: process.env.MQTT_BROKER_USERNAME,
    password: process.env.MQTT_BROKER_PASSWORD,
})

client.on('connect', function () {
    client.subscribe('#')
})

client.on('message', function (topic, message) {
    context = message.toString();
    console.log(topic + ' ' + context)
})