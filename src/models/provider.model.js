const mongoose = require('mongoose')


const providerSchema = new mongoose.Schema({
    providerName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    serviceType:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    documents:{
        aadharCard:{
            type:Image,
            required:true
        },
        certificate:{
            type:Image,
            required:true
        }
    },
    profileImage:{
        type:Image
        
    }
})


const providerModel= new mongoose.model('Provider',providerSchema)


module.exports = providerModel