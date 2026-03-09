const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    description:{ 
        type:String,
        
    },
    icon:{
        type:String,
        
    },
    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }
},{timestamps:true})

const categoryModel = new mongoose.model('Category',categorySchema)

module.exports = categoryModel