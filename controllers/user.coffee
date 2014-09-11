express = require 'express'
passport = require 'passport'

View = require '../lib/view'
Main = require './user/main.coffee'
ParseCities = require './user/parseCities.coffee'
socialConfig = require '../meta/socialConfig'

Router = express.Router()

Router.use (req, res, next) ->
	ie = (/MSIE ([0-9]{1,}[\.0-9]{0,})/g).exec req.headers['user-agent']
	if ie is null
		next()
	else
		version = parseFloat ie[0].replace('MSIE ', '')
		if version > 8
			next()
		else
			Main.ie req, res

Router.get '/', Main.index
Router.post '/personalData', Main.setPersonalData
Router.put '/personalData', Main.setPersonalData
Router.get '/simplePage/:id', Main.index

Router.get '/auth/facebook', Main.facebookLogin
Router.get '/auth/facebook/callback', passport.authenticate 'facebook',
	successRedirect: '/simplePage/hello-page'
	failureRedirect: '/'

Router.get '/auth/odnoklassniki', Main.odnoklassnikiLogin
Router.get '/auth/'+socialConfig.odnoklassniki.clientID, passport.authenticate "odnoklassniki",
	successRedirect: '/simplePage/personal-form'
	failureRedirect: "/simplePage/login-page"


exports.Router = Router