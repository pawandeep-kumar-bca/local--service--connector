const notificationModel = require('../models/notification.model')
const userModel = require('../models/User.model')


async function createNotification(req,res) {
    try{ 
      const {receiverId,type,title,message,relatedId,relatedModel} = req.body
     const senderId = req.user.id
    if(!receiverId || !message || !type){
        return res.status(400).json({message:'All filed are required'})
    }
   if(receiverId === senderId){
    return res.status(400).json({message:"invalid receiver id"})
   }
    const receiver = await userModel.findById(receiverId)
    if(!receiver){
        return res.status(404).json({message:'user not found'})
    }
    const notification = await notificationModel.create({
        receiverId,
        type,
        senderId,
        title,message,relatedId,relatedModel
    })
    return res.status(201).json({
        message:'notification created successfully',
        notification
    })}catch(err){
        console.error('create notification error:',err);
        return res.status(500).json({message:'Internal server error'})
        
    }
}

module.exports = {
    createNotification
}