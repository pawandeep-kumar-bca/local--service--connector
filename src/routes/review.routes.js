const express = require('express')
const reviewController = require('../controllers/review.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()


// POST   /api/v1/reviews

router.post('/',authMiddleware.tokenVerify,reviewController.reviewCreate)

// GET    /api/v1/reviews/provider/:providerId 

router.get('/provider/:providerId',authMiddleware.tokenVerify,reviewController.reviewCreate)

// DELETE /api/v1/reviews/:id
router.delete('/:id',authMiddleware.tokenVerify,reviewController.deleteReview)


module.exports = router