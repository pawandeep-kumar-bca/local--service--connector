const mongoose = require('mongoose')
 


async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Server is connected to Database');
        
    }catch(err){
        console.log("Database connection error",err);
        
    }
}

module.exports = connectDB