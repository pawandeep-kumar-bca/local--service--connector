const userModel = require("../models/User.model");

async function getUserProfile(req, res) {
  try {
    const userExists = await userModel.findById(req.user).select("-password");
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User profile fetched",
      id: userExists._id,
      fullname: userExists.fullname,
      email: userExists.email,
      role: userExists.role,
      isVerified: userExists.isVerified,
    });
  } catch (err) {
    console.error("User profile error:", err);

    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUserProfile(req, res) {
  try {
    const { fullname } = req.body;
    if (!fullname) {
      return res.status(400).json({ message: "fullname field is required" });
    }
    const userExists = await userModel.findById(req.user).select('-password');

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
   
    userExists.fullname = fullname
    await userExists.save()
    return res.status(200).json({
      message: "User profile updated",
      userExists: {
        id: userExists._id,
        fullname: userExists.fullname,
        email: userExists.email,
        role: userExists.role,
      },
    });
  } catch (err) {
    console.error("User update profile error:", err);

    return res.status(500).json({ message: "Internal server error" });
  }
}

async function changePassword(req,res){
try{
const {oldPassword,newPassword,confirmPassword} = req.body

const userExists = await userModel.findById(req.user).select('+password')

if(!userExists){
  return res.status(404).json({message:'User not found'})
}
if(!oldPassword || !newPassword || !confirmPassword){
  return res.status(400).json({message:"all field are required"})
}
const isMatch = await userExists.comparePassword(oldPassword)
if(!isMatch){
  return res.status(400).json({message:"Old password not match"})
}
if(newPassword !== confirmPassword){
  return res.status(400).json({message:"new password not match"})
}
if(oldPassword === newPassword || newPassword.length < 6 ){
  return res.status(400).json({message:'New password must be different and at least 6 characters'})
}
userExists.password = newPassword
await userExists.save()
return res.status(200).json({message:'New password change successfully '
})}catch(err){
  console.error('Change password error:',err);
  return res.status(500).json("Internal server error")
  
}
}
module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword
};
