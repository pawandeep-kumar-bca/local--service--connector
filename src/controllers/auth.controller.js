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

async function loginUser(req, res) {}

async function refreshToken(req, res) {}

async function verifyEmail(req, res) {}

async function forgotPassword(req, res) {}

async function resetPassword(req, res) {}

async function logoutUser(req, res) {}

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logoutUser,
};
