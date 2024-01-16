import mongoose from 'mongoose';
const { Schema } = mongoose;


const followerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    }
});


const followingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    }
});


const userSchema = new Schema({
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
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bio: String,
    followers: [followerSchema],
    profilePicture: String,
    following: [followingSchema],
    isAdmin: {
        type: Boolean,
        default: false
    },
    isUpgrade: {
        type: Boolean,
        default: false
    },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
