const mongoose = require('mongoose')


async function validateObjectId(req,res,next){
    try{
        const providerId  = req.params.id
        if(!mongoose.Types.ObjectId.isValid(providerId)){
         return res.status(400).json({message:'Invalid provider id'})
         }
         next()
    }catch(err){
        console.error('validateObjectId error:',err);
        return res.status(500).json({message:'Internal server error'})
        
    }
}
module.exports= validateObjectId