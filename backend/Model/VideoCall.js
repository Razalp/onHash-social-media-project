import mongoose from 'mongoose';


const videoCallSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['initiated', 'accepted', 'ended'],
    default: 'initiated'
  },

}, { timestamps: true });


const VideoCall = mongoose.model('VideoCall', videoCallSchema);


export default VideoCall;