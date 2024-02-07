// StoryModel.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const storySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

const Story = mongoose.model('Story', storySchema);

export default mongoose.models.Story || mongoose.model('Story', storySchema);
