const reviewModel = require('../models/review.model')
const bookingModel = require('../models/booking.model')
const providerModel = require('../models/provider.model')
async function reviewCreate(req,res){
    try{const {rating,comment} = req.body
    const bookingId = req.params.id
    const userId = req.user.id
    if(!rating || !bookingId){
        return res.status(400).json({message:'Rating and bookingId required'})
    }
    
    const booking = await bookingModel.findById(bookingId)
    if(!booking){
        return res.status(404).json({message:'Booking not found',
            booking:[]
        })
    }
    if(booking.userId.toString() !== userId.toString()){
        return res.status(403).json({message:'Unauthorized'})
    }
    if(booking.bookingStatus !==  'Completed'){
        return res.status(400).json({message:'Booking not completed'})
    }
    const reviewAlreadyExists = await reviewModel.findOne({bookingId})
    if(reviewAlreadyExists){
        return res.status(400).json({message:'Review already submitted'})
    }
    const review = await reviewModel.create({
        userId,
        bookingId,
        providerId:booking.providerId,
        rating,
        comment
    })
    return res.status(201).json({
        message:'Review created successfully',
        review
    })}catch(err){
        console.error('Review create error:',err);
        return res.status(500).json({message:'Internal server error'})
        
    }
}

async function providerReview(req,res){
 try{const providerId = req.params.providerId

  if(!providerId){
    return res.status(400).json({message:'providerId is missing'})
  }
  const reviews = await reviewModel.find({providerId:providerId}).populate('userId','name')

  if(reviews.length === 0){
    return res.status(200).json({
        message:'reviews not found',
       reviews:[]
    })
  }
  return res.status(200).json({message:'provider review fetch successfully',
    providerId,
    totalReview:reviews.length,
    reviews
  })
}catch(err){
    console.error('provider review error:',err);
    return res.status(500).json({message:'Internal server error'})
    
}
}

async function deleteReview(req,res) {
try{   const reviewId= req.params.id
    const userId = req.user.id
   

    if(!reviewId){
        return res.status(400).json({message:'Invalid review Id'})
    }
    const reviewExists = await reviewModel.findById(reviewId)
    if(!reviewExists){
        return res.status(404).json({message:"review not found"})
    }
    if(reviewExists.userId.toString() !== userId.toString()){
        return res.status(403).json({message:'Unauthorized'})
    }
    const deletedReview = await reviewModel.findByIdAndDelete(reviewId)

    return res.status(200).json({message:'review deleted successfully',
        deletedReview
    })}catch(err){
        console.error('Delete review error:',err);
        return res.status(500).json({message:'internal server error'})
        
    }
}

module.exports= {
    reviewCreate,
    providerReview,
    deleteReview
}