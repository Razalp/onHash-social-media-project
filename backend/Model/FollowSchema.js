import mongoose from 'mongoose';
const { Schema } = mongoose;

const followSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

const Follow = mongoose.model('Follow', followSchema);

export default mongoose.models.Follow || mongoose.model('Follow', followSchema);
