async = require 'async'
_ = require 'underscore'
xlsx = require 'node-xlsx'

View = require '../../lib/view'
Model = require '../../lib/model'
#Auth = require '../../lib/auth'
#socialConfig = require '../../meta/socialConfig'
#Document = require '../../utils/document'



exports.index = (req, res) ->
	async.waterfall [
		(next) ->
			obj = xlsx.parse  __dirname + '/parse.xlsx'
			netArray = obj.worksheets[0].data

			for network in netArray
				item = {name: network[0].value}
				Model 'Network', 'create', null, item

			View.clientSuccess netArray, res
	], (err) ->
		res.send err

