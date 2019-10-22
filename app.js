
const cityClimate = require('./lab6.js')
const express = require('express') //new
const app = express() //new
const port = process.env.PORT || 3000 //new

// cityClimate.longAndLatFunc('Mexico', function(error, data){
// 	if(error){
// 		console.log(error)
// 	}else{
// 		cityClimate.climateFunc(data.cityName, data.longAndLat, function(error, data){
// 			console.log(data)
// 		})
// 	}
// })

app.get('', function(req, res){
	res.send({
		greeting: 'Hello! App is working!'
	})
})

app.get('*', function(req, res){
	res.send({
		error: 'Ruta invalida'
	})
})

app.get('/weather', function(req, res){
	if(!req.query.search){
		res.send({
			error: 'Debes enviar el nombre de una ciudad'
		})
	}
	cityClimate.longAndLatFunc(req.query.search, function(error, response){
		if(error){
			return res.send({
				error: error
			})
		}
		if(response.longAndLat){
			var city = response.cityName
			cityClimate.climateFunc(response.city, response.longAndLat, function(error, response){
				if(error){
					return res.send({
						error: error
					})
				}
				res.send({ //lo que quiero que imprima al final
					city: city,
					longLat: response.longAndLat,
					desc: response.description,
					temp: response.temp,
					precip: response.precip
				})
			})
		}else{//por si no tiene long and lat la ciudad
			res.send(response)
		}
	})
})

app.listen(port, function(){
	console.log('Up and running')
})



