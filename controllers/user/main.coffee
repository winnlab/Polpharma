async = require 'async'
_ = require 'underscore'

View = require '../../lib/view'
Model = require '../../lib/model'
Auth = require '../../lib/auth'
socialConfig = require '../../meta/socialConfig'
Document = require '../../utils/document'

locale = require '../../locale'

langs = null


filterLang = (array, languageId) ->
	_.map array, (el) ->
		el.lang = _.find el.lang, (lang) ->
			lang.language_id.toString() == languageId.toString()
		return el

mergeArrays = (origin, merged, originField, mergedField, resultField) ->
	_.map origin, (orig) -> 
		_.each merged, (merg) ->			
			orig[resultField] = merg if orig[originField].toString() == merg[mergedField].toString()
	return origin

getData = (req, lang, cb) ->
	async.parallel
		simplePages: (proceed) ->
			Model 'SimplePage', 'find', proceed
		networks: (proceed) ->
			Model 'Network', 'find', proceed
		cities: (proceed) ->
			Model 'City', 'find', proceed

	, (err, data) ->
		return cb err if err
		data.user = if req.user then req.user else {}
		if req.user
			data.user.username = req.user.odnoklassniki?.name.givenName
			data.user.usersurname = if req.user then req.user.odnoklassniki?.name.familyName
		data.lang = if lang.default then '' else lang.isoCode		
		data.langs = _.map langs, (lang)-> 
			return _.pick lang, 'isoCode', 'default'
		data.locale = locale[lang.isoCode]
		data.socialConfig = socialConfig
		cb null, data

getQueryLang = (url, cb) ->
	# Todo change find lang to regExp
	queryString = url.split('/')[1]
	lang = _.findWhere langs, isoCode: queryString
	if lang
		cb null, lang
	else
		cb null, (_.findWhere langs, default: true)


exports.index = (req, res) ->

	async.waterfall [
		(next) ->
			if langs
				next null, langs
			else
				Model 'Language', 'find', next
		(docs, next) ->
			langs = docs
			getQueryLang req.originalUrl, next
		(lang, next) ->
			getData req, lang, next
		(data, next) ->
			View.render 'user/index', res, {data}
	], (err) ->
		res.send err

exports.getRandomMind = (req, res) ->
	async.waterfall [
		(next) ->
			getMindData next

		(data, next) ->
			View.clientSuccess {data}, res
	], (err) ->
		res.send err

getMindData = (cb) ->
	async.parallel
		mind: (proceed) ->
			Model 'Mind', 'find', proceed
		mindImage: (proceed) ->
			Model 'MindImage', 'find', proceed

	, (err, data) ->
		return cb err if err

		if data.mind.length > 0 && data.mindImage.length > 0
			randomMind = {}

			mindIndex = Math.floor(Math.random() * (parseInt(data.mind.length)))
			imageIndex = Math.floor(Math.random() * (parseInt(data.mindImage.length)))
			randomMind.mind = data.mind[mindIndex]
			randomMind.image = data.mindImage[imageIndex]

			cb null, randomMind
		else
			cb null, null

exports.ie = (req, res) ->
	View.render 'user/ie', res, {}

exports.facebookLogin = Auth.authenticate 'facebook'
exports.odnoklassnikiLogin = Auth.authenticate 'odnoklassniki'

exports.setPersonalData = (req, res) ->
	_id = req.body._id
	data = req.body

	async.waterfall [
		(next) ->
			if _id
				Model 'Visitor', 'findOne', next, {_id}
			else if data.facebook and data.facebook.id
				Model 'Visitor', 'findOne', next, {'facebook.id': data.facebook.id}
			else if data.vk and data.vk.uid
				Model 'Visitor', 'findOne', next, {'vk.uid': data.vk.uid}
			else if data.odnoklassniki and data.odnoklassniki.id
				Model 'Visitor', 'findOne', next, {'odnoklassniki.id': data.odnoklassniki.id}
			else
				next null, null
		(doc, next) ->
			if doc
				doc = Document.setDocumentData doc, data
				doc.save next
			else
				Model 'Visitor', 'create', next, data
		(doc, next) ->
			View.clientSuccess _id: doc._id, res
	], (err) ->
		res.send err
