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
			Model 'MindImage', 'find', next, {}, null
		(mindImages)->
			View.clientSuccess {mindImages}, res
	], (err)->
		setFail err, res

exports.save = (req, res) ->
	_id = req.body._id
	data = req.body

	async.waterfall [
		(next) ->
			if _id
				Model 'MindImage', 'findOne', next, {_id}
			else
				next null, null
		(doc, next) ->
			if doc
				doc = Document.setDocumentData doc, data
				doc.save next
			else
				Model 'MindImage', 'create', next, data
		(doc, next) ->
			View.clientSuccess _id: doc._id, res
	], (err) ->
		setFail err, res

exports.delete = (req, res) ->
	_id = req.params.id

	async.waterfall [
		(next) ->
			Model 'MindImage', 'findOne', next, {_id}
		(doc, next) ->
			doc.remove next
		(next) ->
			View.clientSuccess 'Картинка мысли успешно удалена!', res
	], (err) ->
		setFail err, res

exports.imageSave = (req, res) ->
	_id = req.body.id
	imageName = req.body.name

	async.waterfall [
		(next) ->
			Model 'MindImage', 'findById', next, _id
		(mindImage, next) ->
			Files.unlinkArray [mindImage?.image?[imageName]], uploadPath, (err) ->
				next err, mindImage
		(mindImage, next) ->
			if req.files?[imageName]?.name
				mindImage.image = req.files[imageName].name

			mindImage.save next
		(doc, numberAffected) ->
			View.clientSuccess name: doc.image, res
	], (err) ->
		setFail err, res

exports.imageDelete = (req, res) ->
	_id = req.body.id
	imageName = req.body.name

	async.waterfall [
		(next) ->
			Model 'MindImage', 'findOne', next, _id: _id
		(mindImage, next) ->
			Files.unlinkArray [mindImage.image], uploadPath, (err) ->
				next err, mindImage
		(mindImage, next) ->
			mindImage.image = undefined
			mindImage.save next
		(doc, numberAffected) ->
			View.clientSuccess 'Картинка успешно удалена', res
	], (err) ->
		setFail err, res