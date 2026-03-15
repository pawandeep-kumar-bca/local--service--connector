const express = require('express')
const adminControllers = require('../controllers/category.controller')
const providerMiddleware = require('../middlewares/auth.middleware')
const roleBased = require('../middlewares/role.middleware')
const routes = express.Router()


routes.post('/',providerMiddleware.tokenVerify,roleBased('Admin'),adminControllers.createCategory)
routes.get('/',adminControllers.getCategory)
routes.put('/:id',providerMiddleware.tokenVerify,roleBased('Admin'),adminControllers.getCategory)
routes.delete('/:id',providerMiddleware.tokenVerify,roleBased('Admin'),adminControllers.deleteCategory)

module.exports = routes