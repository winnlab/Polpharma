mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

MindImageSchemaFields =
	name:
		type: String
		required: true
	image:
		type: String
		default: ''

options =
	collection: 'mindImages'

MindImageSchema = new mongoose.Schema MindImageSchemaFields, options

module.exports =  mongoose.model 'MindImage', MindImageSchema