import mongoose from "mongoose";


const userStackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 100 },  
  totalEarned: { type: Number, default: 0 },
  claimedRewards: { type: Number, default: 0 },
  unclaimedRewards: { type: Number, default: 0 },
  rewardType: { type: String, enum: ['cash'] },
  rewards: [{
    time: Number,  // 10min cycle number
    amount: Number,  // 1% reward
  }],

},   

{ timestamps: true }
);



const UserStack = mongoose.model('UserStack', userStackSchema);

export default UserStack;