const mongoose = require('mongoose');
const validator = require("validator");
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter Name"]

    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Enter your Password"],
        minLength: [8, "Password should not less than 8 character"],
        select: false //all data fetched but password not fetched
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bycrypt.hash(this.password, 10);
})
userSchema.methods.getjwttoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWTSECERT, {
        expiresIn: process.env.JWTEXPIRE,
    })
}

userSchema.methods.comparePassword = async function (password) {
    return await bycrypt.compare(password, this.password);
  };
  
  // Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
module.exports = mongoose.model("User", userSchema)