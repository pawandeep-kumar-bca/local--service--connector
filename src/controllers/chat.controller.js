const chatModel = require('../models/chat.model')
const bookingModel = require('../models/booking.model')

async function chatMessages(req,res) {
try{    const bookingId = req.params.bookingId
    const userId =  req.userId
    const booking = await bookingModel.findById(bookingId)
    if(!booking){
        return res.status(404).json({
            message:'booking not found',
            booking:[]
        })
    }
    if(userId !== booking.userId.toString() && userId !== booking.providerId.toString()){
        return res.status(403).json({message:'forbidden'})
    }
    const chats = await chatModel.find({bookingId:bookingId}).sort({ createdAt: 1 })
    return res.status(200).json({message:'All chats fetched successfully',
        chats
    })}catch(err){
        console.error('chat messages error:',err);
        
        return res.status(500).json({message:'Internal server error'})
    }
}



module.exports =  {
    chatMessages
}