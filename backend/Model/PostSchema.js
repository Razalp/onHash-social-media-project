import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: [{
        type: String,
    }],
    
    caption: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    reportedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    reports: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reason: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
});

const Post = mongoose.model('Post', postSchema);

export default Post;


