async = require 'async'
Logger = require '../lib/logger'
socialConfig = require '../meta/socialConfig'

passport = require 'passport'
localStrategy = require('passport-local').Strategy
facebookStrategy = require('passport-facebook').Strategy
odnoklassnikiStrategy = require('passport-odnoklassniki').Strategy

mongoose = require 'mongoose'
Model = require '../lib/model'

parameters =
	usernameField: 'username'
	passwordField: 'password'

passport.serializeUser (user, done) ->
	done null, user.id

passport.deserializeUser (id, done) ->

	async.waterfall [
		(next)->
			Model 'User', 'findOne', next, {_id : id}
		(user, next) ->
			if user
				done null, user
			else
				Model 'Visitor', 'findOne', done, {_id : id}
	], done

validation = (err, user, password, done) ->
	if err
		return done err
	if not user
		return done null, false, { message: 'Пользователь с таким именем не существует!' }
	if not user.validPassword password
		return done null, false, { message: 'Пароль введен неправильно.' }

	done null, user

adminStrategy = (username, password, done) ->
	cb = (err, user) ->
		validation err, user, password, done
	Model 'User', 'findOne', cb, {username : username}

userStrategy = (username, password, done) ->
	cb = (err, user) ->
		validation err, user, password, done
	Model 'Client', 'findOne', cb, {username : username}

exports.init = (callback) ->
	adminAuth = new localStrategy adminStrategy
	clientAuth = new localStrategy userStrategy

	facebookAuth = new facebookStrategy
		clientID        : socialConfig.facebook.clientID
		clientSecret    : socialConfig.facebook.clientSecret
		callbackURL     : socialConfig.facebook.callbackURL
		profileFields   : ['id', 'name', 'picture', 'emails', 'displayName', 'gender']

	, (accessToken, refreshToken, profile, done) ->

		process.nextTick ->
			async.waterfall [
				(next) ->
					Model 'User', 'findOne', next, {'facebook.id': profile.id}
				(user, next) ->
					if user
						done null, user
					else
						Model 'User', 'create', done,
							facebook:
								id: profile.id
								token: accessToken
								image: "https://graph.facebook.com/" + profile.id + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken
							username: profile.name.givenName
							email: profile.emails[0].value
							role: 'user'
			], done

	odnoklassnikiAuth = new odnoklassnikiStrategy
		clientID: socialConfig.odnoklassniki.clientID
		clientPublic: socialConfig.odnoklassniki.clientPublic
		clientSecret: socialConfig.odnoklassniki.clientSecret
		callbackURL: socialConfig.odnoklassniki.clientID

	, (accessToken, refreshToken, profile, done) ->

		process.nextTick ->
			async.waterfall [
				(next) ->
					Model 'Visitor', 'findOne', next, {'odnoklassniki.id': profile.id}
				(visitor, next) ->
					if visitor
						done null, visitor
					else
						Model 'Visitor', 'create', done,
							odnoklassniki:
								id: profile.id
								name: profile.name
								birthday: profile._json.birthday
			], done

	passport.use 'facebook', facebookAuth
	passport.use 'odnoklassniki', odnoklassnikiAuth
	passport.use 'admin', adminAuth
	passport.use 'user', clientAuth

	callback()