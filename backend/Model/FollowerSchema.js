import mongoose from 'mongoose';

const { Schema } = mongoose;

const followerSchema = new Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default followerSchema;
