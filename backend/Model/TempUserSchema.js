// TempUserModel.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const tempUserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bio: String,
    profilePicture: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isUpgrade: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpiresAt: {
        type: Date,
        required: true,
    },
});

const TempUser = mongoose.model('TempUser', tempUserSchema);

export default mongoose.models.TempUser || mongoose.model('TempUser', tempUserSchema);
