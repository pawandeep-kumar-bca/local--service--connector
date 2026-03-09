const express = require('express')
const providerControllers = require('../controllers/provider.controller')
const routes = express.Router()





routes.post('/',providerControllers.providerProfileCreate)

module.exports= routes