mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

SimplePageSchemaFields =
	name:
		type: String
		required: true
	content:
		type: String
		required: false
	ready:
		type: Boolean
		required: false
	url:
		type: String
		required: true
	alternate_view_path:
		type: String
		required: false

options =
	collection: 'simplePages'

SimplePageSchema = new mongoose.Schema SimplePageSchemaFields, options

module.exports =  mongoose.model 'SimplePage', SimplePageSchema