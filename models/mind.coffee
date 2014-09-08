mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

MindSchemaFields =
	name:
		type: String
		required: true
	content:
		type: String
		required: false
	image:
		type: String
		default: ''
	url:
		type: String
		required: false
	alternate_view_path:
		type: String
		required: false

options =
	collection: 'minds'

MindSchema = new mongoose.Schema MindSchemaFields, options

module.exports =  mongoose.model 'Mind', MindSchema