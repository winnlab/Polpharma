async = require 'async'
_ = require 'underscore'

View = require '../../lib/view'
Model = require '../../lib/model'
Files = require '../../lib/files'
Logger = require '../../lib/logger'
Document = require '../../utils/document'

uploadPath = './uploads/'

setFail = (err, res) ->
	msg = "Error in #{__filename}: #{err.message or err}"
	Logger.log 'error', msg
	View.clientFail err, res

exports.findAll = (req, res) ->
	async.waterfall [
		(next)->
			Model 'Mind', 'find', next, {}, null
		(minds)->
			View.clientSuccess {minds}, res
	], (err)->
		setFail err, res

exports.save = (req, res) ->
	_id = req.body._id
	data = req.body

	async.waterfall [
		(next) ->
			if _id
				Model 'Mind', 'findOne', next, {_id}
			else
				next null, null
		(doc, next) ->
			if doc
				doc = Document.setDocumentData doc, data
				doc.save next
			else
				Model 'Mind', 'create', next, data
		(doc, next) ->
			View.clientSuccess _id: doc._id, res
	], (err) ->
		setFail err, res

exports.delete = (req, res) ->
	_id = req.params.id

	async.waterfall [
		(next) ->
			Model 'Mind', 'findOne', next, {_id}
		(doc, next) ->
			doc.remove next
		(next) ->
			View.clientSuccess 'Мысль успешно удалена!', res
	], (err) ->
		setFail err, res

exports.imageSave = (req, res) ->
	_id = req.body.id
	imageName = req.body.name

	async.waterfall [
		(next) ->
			Model 'Mind', 'findById', next, _id
		(mind, next) ->
			Files.unlinkArray [mind?.image?[imageName]], uploadPath, (err) ->
				next err, mind
		(mind, next) ->
			if req.files?[imageName]?.name
				mind.image = req.files[imageName].name

			mind.save next
		(doc, numberAffected) ->
			View.clientSuccess name: doc.image, res
	], (err) ->
		setFail err, res

exports.imageDelete = (req, res) ->
	_id = req.body.id
	imageName = req.body.name

	async.waterfall [
		(next) ->
			Model 'Mind', 'findOne', next, _id: _id
		(mind, next) ->
			Files.unlinkArray [mind.image], uploadPath, (err) ->
				next err, mind
		(mind, next) ->
			mind.image = undefined
			mind.save next
		(doc, numberAffected) ->
			View.clientSuccess 'Картинка успешно удалена', res
	], (err) ->
		setFail err, res