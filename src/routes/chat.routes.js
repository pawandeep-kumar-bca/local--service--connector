const express = require('express')
const chatController= require('../controllers/chat.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const ObjectIdMiddleware = require('../middlewares/validateObjectId.middleware')
const router = express.Router()



// GET  /api/v1/chats/:bookingId/messages 


router.get('/:bookingId/messages',authMiddleware.tokenVerify,ObjectIdMiddleware,chatController.chatMessages)


module.exports = router