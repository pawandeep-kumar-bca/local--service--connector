
const userModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const sendEmail  = require('../utils/sendEmail')
async function registerUser(req, res) {
  try {
    const { fullname, email, password, role} = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await userModel.create({
      fullname,
      email,
      password,
      role: role || "user",
    });
    const emailVerify = crypto.randomBytes(16).toString("hex")
    
    user.emailVerificationToken = emailVerify
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000
    await user.save()

    sendEmail(
    // `${process.env.EMAIL_USER}`,
  `${user.email}`,
  '<p>Verify Your Email</p>',
  '<p>Please click the link below to verify your email:</p>',
  `<a href=http://localhost:3000/api/v1/auth/verify-email/${emailVerify}>Verify Email</a>`
);
    // const token = jwt.sign( 
    //   {
    //     id: user._id,
    //     role: user.role,
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" },
    // );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        emailVerificationToken:user.emailVerificationToken,
       emailVerificationExpires: user.emailVerificationExpires
      },
    });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if(!user.isVerified){
 return res.status(403).json({message:"Please verify your email first"})
}
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "10m" },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    user.refreshToken = refreshToken
    await user.save()
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 *1000,
    });
    return res.status(200).json({
      message: "User logged in successfully",
      accessToken: accessToken,
      user: {
        id: user._id,
        email: user.email,
        role:user.role
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.id;

    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if(refreshToken !== userExists.refreshToken){

      return res.status(401).json({ message: "Unauthorized" });
    }
      
    const newAccessToken = jwt.sign(
      {
        id: userId,
        role: userExists.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "10m" },
    );

    return res.status(200).json({ accessToken: newAccessToken });
    
  } catch (err) {
    console.error("Error in refreshToken:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
}

async function logoutUser(req, res) {
 try{
  const refreshToken = req.cookies.refreshToken
  if(!refreshToken){
    return res.status(200).json({message:'user already logged out'})
  }
 const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)

 const userExists = await userModel.findById(decoded.id)
if(!userExists){
  return res.status(401).json({message:'Unauthorized'})
}
 if(refreshToken !== userExists.refreshToken){
  return res.status(401).json({message:"Unauthorized"})
 }
 userExists.refreshToken = null;
 await userExists.save()
 
 res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
})
return res.status(200).json({message:"User logged out successfully"})


}catch(err){
 console.error("Error in logoutUser:", err);
    res.status(500).json({ message: "Internal Server Error" });
 }

}


async function me(req, res) {
try {const userId = req.user
 if(!userId){
  return res.status(401).json({message:"Unauthorized"})
 }
 const user = await userModel.findById(userId).select("-password")

 
 if(!user){
  return res.status(401).json({message:"Unauthorized"})
 }
 return res.status(200).json({
  message: "User fetched successfully",
  email:user.email,
  role:user.role
  
})}catch(err){
  console.error("logged in error:",err);
  
  return res.status(500).json({message:'Internal server error'})
 }
}




 

async function verifyEmail(req, res) {
 try{
  const token = req.params.token

  
  const user = await userModel.findOne({emailVerificationToken:token})
  if(!user){
    return res.status(404).json({message:'Invalid or expired verification token'})
  }
  if(user.emailVerificationExpires < Date.now()){
    return res.status(400).json({message:"Verification token expired"})
  }
  user.emailVerificationToken  = null
  user.emailVerificationExpires = null
  user.isVerified = true
  await user.save()
 return  res.status(200).json({message:"Email verified successfully",
    email:user.email

  })

 }catch(err){
  console.error("Email verify error:",err);
  return res.status(500).json({message:"Internal server error"})
  
 }

}

async function forgotPassword(req, res) {}

async function resetPassword(req, res) {

}

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
