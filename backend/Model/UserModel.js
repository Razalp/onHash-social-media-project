import mongoose from 'mongoose';
const { Schema } = mongoose;


const followerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});
const followingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',

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
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bio: String,
    followers: [followerSchema],
    profilePicture: {
        type: String,
        default: 'default-profile-image.jpg', 
    },
    following: [followingSchema],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isUpgrade: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model('User', userSchema);


export default mongoose.models.User || mongoose.model('User', userSchema);
