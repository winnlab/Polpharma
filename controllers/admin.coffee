express = require 'express'

View = require '../lib/view'

Main = require './admin/main'
SimplePage = require './admin/simplePages'
Mind = require './admin/minds'
MindImage = require './admin/mindImages'

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

Router.post '/mind/image', Mind.imageSave
Router.delete '/mind/image', Mind.imageDelete

Router.get '/mind', Mind.findAll
Router.post '/mind', Mind.save
Router.put '/mind/:id?', Mind.save
Router.delete '/mind/:id?', Mind.delete

#----------------#

Router.post '/mindImage/image', MindImage.imageSave
Router.delete '/mindImage/image', MindImage.imageDelete

Router.get '/mindImage', MindImage.findAll
Router.post '/mindImage', MindImage.save
Router.put '/mindImage/:id?', MindImage.save
Router.delete '/mindImage/:id?', MindImage.delete

#----------------#

exports.Router = Router
exports.layoutPage = Main.dashboard