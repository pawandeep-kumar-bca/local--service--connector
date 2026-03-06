const userModel = require("../models/User.model");
const jwt = require('jsonwebtoken')

async function registerUser(req, res) {
  try {
    const { fullname, email, password, role } = req.body;

    const isUserAlreadyExists = await userModel.findOne({email});

    if (isUserAlreadyExists) {
      return res.status(409).json({ message: "Email already exists" });
    }


    const user = await userModel.create({
      fullname,
      email,
      password,
      role: role || "user",
    });

    const token = jwt.sign({
      id:user._id,
      role:user.role
    }, process.env.JWT_SECRET, { expiresIn: '1d' })


    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
});

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try{const {email,password} = req.body;
  
  const user =await userModel.findOne({email}).select("+password");

  if(!user){
   return res.status(401).json({message:"Invalid credentials"})
  }
  const isMatch = await user.comparePassword(password);
   if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({
      id:user._id,
      role:user.role
    },process.env.JWT_SECRET,{ expiresIn: '1d' })

    res.cookie('token',token,{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
})
return res.status(200).json({
  message:'User logged in successfully',
  user:{
    email:user.email
  }
})}catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function refreshToken(req, res) {

  
}





async function logoutUser(req, res) {}
async function me(req, res) {}
async function verifyEmail(req, res) {}

async function forgotPassword(req, res) {}

async function resetPassword(req, res) {}



module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logoutUser,
};
