import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, default: Date.now,  } 
});

const UserOtp = mongoose.model('userOtp', otpSchema);

export default UserOtp;
