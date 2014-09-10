mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

CitySchemaFields =
	name:
		type: String
		required: true

options =
	collection: 'cities'

CitySchema = new mongoose.Schema CitySchemaFields, options

module.exports =  mongoose.model 'City', CitySchema