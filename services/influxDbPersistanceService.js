const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const client = new InfluxDB({
    url: process.env.INFLUX_HOST,
    token: process.env.INFLUX_TOKEN
})


const writeApi = client.getWriteApi(process.env.INFLUX_ORGANIZATION, process.env.INFLUX_BUCKET, 's')

async function saveMeasurement(measurement){
    const point = new Point('climate')
        .tag('loc_x', measurement.loc_x)
        .tag('loc_y', measurement.loc_y)
        .tag('floor', measurement.floor)
        .floatField(measurement.parameter, measurement.value)

    writeApi.writePoint(point)

}


module.exports = {saveMeasurement}

