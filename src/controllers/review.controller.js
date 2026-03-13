const reviewModel = require('../models/review.model')
const bookingModel = require('../models/booking.model')
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




module.exports= {
    reviewCreate
}