import mongoose from 'mongoose';

const { Schema } = mongoose;

const followingSchema = new Schema({
    followingId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default followingSchema;
