var mqtt = require('mqtt')

var client  = mqtt.connect(process.env.MQTT_BROKER_URL, {
    username: process.env.MQTT_BROKER_USERNAME,
    password: process.env.MQTT_BROKER_PASSWORD,
})

client.on('connect', function () {
    client.subscribe('#')
    client.on('error', (error) => console.error(error))
})

function onAnyMQTTMessage(handler){
    client.on('message', (topic, message) => {
        console.log('Received message: ' + topic + ' ' + message.toString())
        handler(topic, message.toString())
    })
}

module.exports = {onAnyMQTTMessage}