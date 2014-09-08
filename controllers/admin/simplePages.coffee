async = require 'async'
_ = require 'underscore'

View = require '../../lib/view'
Model = require '../../lib/model'
Logger = require '../../lib/logger'
Document = require '../../utils/document'

setFail = (err, res) ->
	msg = "Error in #{__filename}: #{err.message or err}"
	Logger.log 'error', msg
	View.clientFail err, res

exports.findAll = (req, res) ->
	async.waterfall [
		(next)->
			Model 'SimplePage', 'find', next, {}, null
		(simplePages)->
			View.clientSuccess {simplePages}, res
	], (err)->
		setFail err, res

exports.save = (req, res) ->
	_id = req.body._id
	data = req.body

	async.waterfall [
		(next) ->
			if _id
				Model 'SimplePage', 'findOne', next, {_id}
			else
				next null, null
		(doc, next) ->
			if doc
				doc = Document.setDocumentData doc, data
				doc.save next
			else
				Model 'SimplePage', 'create', next, data
		(doc, next) ->
			View.clientSuccess _id: doc._id, res
	], (err) ->
		setFail err, res

exports.delete = (req, res) ->
	_id = req.params.id

	async.waterfall [
		(next) ->
			Model 'SimplePage', 'findOne', next, {_id}
		(doc, next) ->
			doc.remove next
		(next) ->
			View.clientSuccess 'Страница успешно удалена!', res
	], (err) ->
		setFail err, res