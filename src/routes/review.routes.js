const express = require('express')
const reviewController = require('../controllers/review.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()


// POST   /api/v1/reviews

router.post('/',authMiddleware.tokenVerify,reviewController.reviewCreate)


module.exports = router