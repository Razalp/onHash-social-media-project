    // UserModel.js

    import mongoose from 'mongoose';
    const { Schema } = mongoose;

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
        // following: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'User',
        //     },
        // ],
        // followers: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'User',
        //     },
        // ],

    });

    const User = mongoose.model('User', userSchema);

    export default mongoose.models.User || mongoose.model('User', userSchema);
