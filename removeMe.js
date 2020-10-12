
require('dotenv').config()
let dataService = require('./services/dataProcessingService')

dataService.processSensorMessage('humtemp/10/5/15/sensor/temperature/state',77)