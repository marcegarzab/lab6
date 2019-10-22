
//const credentials = require('./credentials.js')
const request = require('request')

if(process.env.NODE_ENV === 'production'){ //en vez de require('./credentials.js')
	var apikey = process.env.API_KEY
}else{
	const credentials = require('./credentials.js')
	var MAPBOX_TOKEN = credentials.MAPBOX_TOKEN
	var DARK_SKY_SECRET_KEY = credentials.DARK_SKY_SECRET_KEY
}

const longAndLatFunc = function(cityName, callback){ //mapbox api for lat and long
	const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + cityName + '.json?access_token=' + credentials.MAPBOX_TOKEN
	request({url, json:true}, function(error, response){
		if(error){
			callback(error, undefined)
		}else{
			const data = response.body
			if(data.Response == 'False'){
				callback(data.Error, undefined)
			}else{
				const info = {
					longAndLat: data.features[0].center,
					cityName: cityName
				}
				// const longAndLat = data.features[0].center
				callback(undefined, info)
			}
		}
	})
}

const climateFunc = function(cityName, longAndLat, callback){ 
	const lat = parseFloat(longAndLat[1])
	const long = parseFloat(longAndLat[0])

	const url = 'https://api.darksky.net/forecast/' + credentials.DARK_SKY_SECRET_KEY + '/' + lat + "," + long + "?lang=es&units=si"
	request({url, json:true}, function(error, response){
		if(error){
			callback('Unable to connect to OMDB service', undefined)
		}else{
			const data = response.body
			if(data.Response == 'False'){
				callback(data.Error, undefined)
			}else{
				const climate = {
					description : data.hourly.summary,
					temp : data.currently.temperature,
					precip : data.currently.precipProbability
				}
				callback(undefined, climate)
			}
			// console.log(cityName + ": " + climate.description + " Actualmente esta a " + climate.temp + "°C. Hay " + (climate.precip*100) + "% de posibilidad de lluvia.")		
		}
	})
}

module.exports = {
	longAndLatFunc : longAndLatFunc,
	climateFunc: climateFunc
}