const express = require('express')
const notificationController = require('../controllers/notification.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()

// POST /api/v1/notifications

router.post('/',authMiddleware.tokenVerify,notificationController.createNotification)



module.exports = router