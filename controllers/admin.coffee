express = require 'express'

View = require '../lib/view'

Main = require './admin/main'
SimplePage = require './admin/simplePages'
Visitor = require './admin/visitors'

Router = express.Router()

#########################

Router.get '/', Main.index
Router.get '/login', Main.login
Router.get '/logout', Main.logout
Router.get '/dashboard', Main.dashboard

Router.post '/login', Main.doLogin

#----------------#

Router.get '/simplePage', SimplePage.findAll
Router.post '/simplePage', SimplePage.save
Router.put '/simplePage/:id?', SimplePage.save
Router.delete '/simplePage/:id?', SimplePage.delete

#----------------#

Router.get '/exportToExcel', Visitor.exportToExcel
Router.get '/visitor', Visitor.findAll
Router.post '/visitor', Visitor.save
Router.put '/visitor/:id?', Visitor.save
Router.delete '/visitor/:id?', Visitor.delete

#----------------#

exports.Router = Router
exports.layoutPage = Main.dashboard