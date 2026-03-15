const express = require('express')
const notificationController = require('../controllers/notification.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const validateObjectId = require('../middlewares/validateObjectId.middleware')
const router = express.Router()

// POST /api/v1/notifications

router.post('/',authMiddleware.tokenVerify,notificationController.createNotification)

// GET /api/v1/notifications
router.get('/',authMiddleware.tokenVerify,notificationController.getAllNotification)

// PATCH /api/v1/notifications/:id

router.patch('/:id',authMiddleware.tokenVerify,validateObjectId,notificationController.readNotification)

// DELETE /api/v1/notifications/:id
router.delete('/:id',authMiddleware.tokenVerify,validateObjectId,notificationController.deleteNotification)
// GET /api/v1/notifications/unread-count

router.get('/unread-count',authMiddleware.tokenVerify,notificationController.unreadNotification)
module.exports = router