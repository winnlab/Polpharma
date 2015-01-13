mongoose = require 'mongoose'
async = require 'async'

opts =
	server: { auto_reconnect: true, primary:null, poolSize: 50 },
	user: 'admin',
	pass: 'UCLZk2ddmQa8CsH',
	host: '127.0.0.1'
	port: '27017'
	database: 'Polpharma'
	primary: null

connString = 'mongodb://'+opts.user+":"+opts.pass+"@"+opts.host+":"+opts.port+"/"+opts.database+"?auto_reconnect=true"

mongoose.connection.on 'error', (err) ->
	setTimeout(() ->
		mongoose.connect connString, opts
		console.log 'Could not connect to mongo server'
		console.log err
	, 5000)

mongoose.connection.on 'open', (err) ->
	console.log 'Connected to mongo server'

mongoose.connect connString, opts