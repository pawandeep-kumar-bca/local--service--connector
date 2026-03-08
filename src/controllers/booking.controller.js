async function userBookings(req,res){
 try{

    const userExists = await userModel.findById(req.user)
    if(!userExists){
        return res.status(400).json({message:'User not found'})
    }
 }catch(err){
    console.error("User bookings error:",err);
    return res.status(500).json({message:"Internal server error"})
    
 }
}