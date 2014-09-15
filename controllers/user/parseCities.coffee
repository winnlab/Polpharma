async = require 'async'
mysql = require 'mysql'

View = require '../../lib/view'
Model = require '../../lib/model'
#Auth = require '../../lib/auth'
#socialConfig = require '../../meta/socialConfig'
#Document = require '../../utils/document'


exports.index = (req, res) ->
	async.waterfall [
		(next) ->
			connection = mysql.createConnection({
				host     : 'localhost',
				user     : 'root',
				password : 'kernel'
				database : 'okcase'
			});

			connection.connect()

			connection.query 'SELECT * FROM city_langs', next
		(data, next) ->
			for city in data
				cityItem = {name: city.name}
				Model 'City', 'create', null, cityItem

			View.clientSuccess data, res
	], (err) ->
		res.send err

