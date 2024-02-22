// PaymentModel.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        expires: 30 * 24 * 60 * 60, // Expiration time in seconds (30 days)
    },

});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
