mongoose = require 'mongoose'
crypto = require 'crypto'

cryptoUtil = require '../utils/crypto'
validator = require '../utils/validate'

ObjectId = mongoose.Schema.Types.ObjectId

VisitorSchemaFields =
	username: {
		type: String,
		required: false
	}
	password: {
		type: String,
		required: false,
		set: cryptoUtil.password
		validate: validator.password
	}
	facebook:
		id:
			type: String
			required: false
		first_name:
			type: String
			required: false
		last_name:
			type: String
			required: false
	vk:
		uid:
			type: String
			required: false
		first_name:
			type: String
			required: false
		last_name:
			type: String
			required: false
	odnoklassniki:
		id:
			type: String
			required:false
		name:
			familyName:
				type: String
				required: false
			givenName:
				type: String
				required: false
		birthday:
			type: String
	email: {
		type: String,
		required: false
	}
	created_at:
		type: Number
		default: Date.now
	firstName:
		type: String
		required: false
	lastName:
		type: String
		required: false
	birthDay:
		type: String
		required: false
	birthMonth:
		type: String
		required: false
	birthYear:
		type: String
		required: false
	city:
		type: String
		required: false
	city_id:
		type: String
		required: false
	speciality_doc:
		type: String
		required: false
	speciality_apt:
		type: String
		required: false
	institutionType:
		type: Array
		required: false
	jobType:
		type: String
		required: false
	useSocial:
		type: String
		required: false
	socialNetworks:
		type: String
		required: false
	useInternet:
		type: String
		required: false
	usedResources:
		type: String
		required: false
	useInternetTalk:
		type: String
		required: false
	useInternetTalkResources:
		type: String
		required: false
	knowledgeSource:
		type: String
		required: false
	falseInformation:
		type: String
		required: false
	usefulSites:
		type: String
		required: false
	useSmartphones:
		type: String
		required: false
	useSmartphonesTypes:
		type: String
		required: false
	network:
		type: String
		required: false
	network_id:
		type: String
		required: false
	numberAddress:
		type: String
		required: false
	age:
		type: String
		trim: true

options =
	collection: 'visitors'

VisitorSchema = new mongoose.Schema VisitorSchemaFields, options

module.exports =  mongoose.model 'Visitor', VisitorSchema