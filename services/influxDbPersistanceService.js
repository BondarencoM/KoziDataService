const {InfluxDB, Point, flux, fluxDuration} = require('@influxdata/influxdb-client')

const client = new InfluxDB({
    url: process.env.INFLUX_HOST,
    token: process.env.INFLUX_TOKEN
})


const writeApi = client.getWriteApi(process.env.INFLUX_ORGANIZATION, process.env.INFLUX_BUCKET, 's')
const queryApi = client.getQueryApi(process.env.INFLUX_ORGANIZATION)

async function saveMeasurement(measurement){
    const point = new Point('climate')
        .tag('loc_x', measurement.loc_x.toString())
        .tag('loc_y', measurement.loc_y.toString())
        .tag('floor', measurement.floor.toString())
        .tag('is_valid', measurement.is_valid.toString())
        .floatField(measurement.parameter, measurement.value)

    writeApi.writePoint(point)
     
}

function getSensorEntries(location, start = '-5m', end = '0m'){

    const query = flux`
        from(bucket: "${process.env.INFLUX_BUCKET}") 
        |> range(start: ${fluxDuration(start)}, stop: ${fluxDuration(end)})
        |> filter(fn: (r) => r._measurement == "climate"
                                and r.loc_x == "${location.loc_x}" 
                                and r.loc_y == "${location.loc_y}" 
                                and r.floor == "${location.floor}")
    `
    return queryApi.collectRows(query)
}

module.exports = {saveMeasurement, getSensorEntries}
