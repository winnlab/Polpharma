mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

NetworkSchemaFields =
	name:
		type: String
		required: true

options =
	collection: 'networks'

NetworkSchema = new mongoose.Schema NetworkSchemaFields, options

module.exports =  mongoose.model 'Network', NetworkSchema