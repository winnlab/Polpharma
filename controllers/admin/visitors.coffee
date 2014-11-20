async = require 'async'
_ = require 'underscore'
path = require 'path'
mime = require 'mime'
excelbuilder = require 'msexcel-builder'
fs = require 'fs'

View = require '../../lib/view'
Model = require '../../lib/model'
Logger = require '../../lib/logger'
Document = require '../../utils/document'

uploadPath = './uploads/'
visitorsFile = 'visitors.xls'

setFail = (err, res) ->
	msg = "Error in #{__filename}: #{err.message or err}"
	Logger.log 'error', msg
	View.clientFail err, res

exports.findAll = (req, res) ->
	async.waterfall [
		(next)->
			Model 'Visitor', 'find', next, {}, null
		(visitors)->
			View.clientSuccess {visitors}, res
	], (err)->
		setFail err, res

exports.save = (req, res) ->
	_id = req.body._id
	data = req.body

	async.waterfall [
		(next) ->
			if _id
				Model 'Visitor', 'findOne', next, {_id}
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
		setFail err, res

exports.delete = (req, res) ->
	_id = req.params.id

	async.waterfall [
		(next) ->
			Model 'Visitor', 'findOne', next, {_id}
		(doc, next) ->
			doc.remove next
		(next) ->
			View.clientSuccess 'Гость успешно удален!', res
	], (err) ->
		setFail err, res

exports.exportToExcel = (req, res)->

	workbook = excelbuilder.createWorkbook uploadPath, visitorsFile

	async.waterfall [
		(next)->
			Model 'Visitor', 'find', next, {}, null
		(visitors, next)->

#			Sheet name, columns, rows
			visitorsSheet = workbook.createSheet 'Лист посетителей', 28, visitors.length + 1

			visitorsSheet.set 1, 1, 'Имя'
			visitorsSheet.set 2, 1, 'Фамилия'
			visitorsSheet.set 3, 1, 'Возраст'
			visitorsSheet.set 4, 1, 'Email'
			visitorsSheet.set 5, 1, 'Город'
			visitorsSheet.set 6, 1, 'Кем работает'
			visitorsSheet.set 7, 1, 'Специальность'
			visitorsSheet.set 8, 1, 'Тип учреждения'

			visitorsSheet.set 9, 1, 'Пользуется соц. сетями'
			visitorsSheet.set 10, 1, 'Какими соц. сетями'
			visitorsSheet.set 11, 1, 'Интернет для получения проф. знаний'
			visitorsSheet.set 12, 1, 'Ресурсы проф. знаний'

			visitorsSheet.set 13, 1, 'Интернет для общения с пациентами'
			visitorsSheet.set 14, 1, 'Средства общения с пациентами'
			visitorsSheet.set 15, 1, 'Считает интернет важным источником знаний'
			visitorsSheet.set 16, 1, 'Считает, что в Интернет много лодной информации'

			visitorsSheet.set 17, 1, 'Полезные для пациентов сайты'
			visitorsSheet.set 18, 1, 'Пользуется смартфонами'
			visitorsSheet.set 19, 1, 'Какими смартфонами'

			visitorsSheet.set 20, 1, 'Vk ID'
			visitorsSheet.set 21, 1, 'Vk Имя'
			visitorsSheet.set 22, 1, 'Vk Фамилия'

			visitorsSheet.set 23, 1, 'Fb ID'
			visitorsSheet.set 24, 1, 'Fb Имя'
			visitorsSheet.set 25, 1, 'Fb Фамилия'

			visitorsSheet.set 26, 1, 'Ok ID'
			visitorsSheet.set 27, 1, 'Ok Имя'
			visitorsSheet.set 28, 1, 'Ok Фамилия'

			for visitor, key in visitors
				speciality = getSpeciality visitor.speciality_doc, visitor.speciality_apt, visitor.jobType
				jobType = getJobType visitor.jobType
				institutionType = getInstitutionTypes visitor.institutionType
				socialNetworks = getSocialNetworks visitor.socialNetworks

				console.log visitor.vk
				console.log visitor.facebook
				console.log visitor.odnoklassniki

				visitorsSheet.set 1, key+2, visitor.firstName
				visitorsSheet.set 2, key+2, visitor.lastName
				visitorsSheet.set 3, key+2, visitor.age
				visitorsSheet.set 4, key+2, visitor.email
				visitorsSheet.set 5, key+2, visitor.city
				visitorsSheet.set 6, key+2, jobType
				visitorsSheet.set 7, key+2, speciality
				visitorsSheet.set 8, key+2, institutionType

				visitorsSheet.set 9, key+2, acceptReject visitor.useSocial
				visitorsSheet.set 10, key+2, socialNetworks
				visitorsSheet.set 11, key+2, acceptReject visitor.useInternet
				visitorsSheet.set 12, key+2, visitor.usedResources

				visitorsSheet.set 13, key+2, acceptReject visitor.useInternetTalk
				visitorsSheet.set 14, key+2, visitor.useInternetTalkResources
				visitorsSheet.set 15, key+2, acceptReject visitor.knowledgeSource
				visitorsSheet.set 16, key+2, acceptReject visitor.falseInformation

				visitorsSheet.set 17, key+2, visitor.usefulSites
				visitorsSheet.set 18, key+2, acceptReject visitor.useSmartphones
				visitorsSheet.set 19, key+2, visitor.useSmartphonesTypes

				visitorsSheet.set 20, key+2, visitor.vk?.uid
				visitorsSheet.set 21, key+2, visitor.vk?.first_name
				visitorsSheet.set 22, key+2, visitor.vk?.last_name

				visitorsSheet.set 23, key+2, visitor.facebook?.id
				visitorsSheet.set 24, key+2, visitor.facebook?.first_name
				visitorsSheet.set 25, key+2, visitor.facebook?.last_name

				visitorsSheet.set 26, key+2, visitor.odnoklassniki?.id
				visitorsSheet.set 27, key+2, visitor.odnoklassniki?.name?.givenName
				visitorsSheet.set 28, key+2, visitor.odnoklassniki?.name?.familyName

			workbook.save next

		(ok) ->
			View.clientSuccess ok, res
	], (err)->
		setFail err, res

getJobType = (jobType)->
	jobTypes = ['Врач', 'Фармацевт']
	jobTypes[jobType-1];

getSpeciality = (doc, apt, jobType) ->
	result = null;
	specialities_doc = ['педиатр', 'терапевт', 'кардиолог', 'семейный врач', 'гастроэнтеролог', 'невропатолог', 'аллерголог', 'дерматолог', 'пульмонолог', 'офтальмолог', 'инфекционист', 'ЛОР']
	specialities_apt = ['провизор', 'заведующий аптекой', 'менеджер по закупкам']

	if `jobType == 1`
		result = specialities_doc[doc-1]
	else if `jobType == 2`
		result = specialities_apt[apt-1]
	result

getInstitutionTypes = (institutions) ->
	institutionTypes = ['Поликлиника', 'Стационар', 'Сетевая аптека', 'Несетевая аптека']

	result = ''

	if institutions
		for institution in institutions
			result += institutionTypes[institution - 1] + ','

	result.substring 0, result.length - 1

getSocialNetworks = (networks) ->
	networkTypes = ['Facebook', 'Vkontakte', 'Odnoklassniki', 'Twitter']

	result = ''

	if networks?.length > 0
		for network in networks
			result += networkTypes[network - 1] + ','

	result.substring 0, result.length - 1

acceptReject = (value) ->
	result = '';

	if `value == 1`
		result = 'Да'
	else if `value == 2`
		result = 'Нет'
	else
		result = 'Нет ответа'
	result