const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"],
  },

  // 👉 Password optional for Google OAuth users
  password:{
    type:String,
    required:function(){
        return !this.googleId // if googleId not then password is required
    },
    select: false
  },
  refreshToken:{
    type:String,
   
  },
  // 👉 Google OAuth Support
    googleId: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken:{
      type:String
    },
    emailVerificationExpires:{
      type:String
    },
    passwordResetToken:{
      type:String
    },
    passwordResetExpires:{
      type:String
    }
  },
  {
    timestamps: true
  }
);


// ✅ Password Hash Middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
   return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});


// ✅ Compare Password Method (Login ke liye)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);


module.exports = userModel