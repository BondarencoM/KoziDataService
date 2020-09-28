require('dotenv').config()
let mqttService = require('./services/mqttSubscriptionService')
let dataService = require('./services/dataProcessingService')

mqttService.onAnyMQTTMessage(dataService.processSensorMessage)