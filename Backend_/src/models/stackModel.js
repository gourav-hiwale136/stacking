import mongoose from "mongoose";

const userStackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 500 },  
    totalEarned: { type: Number, default: 0 },
    claimedRewards: { type: Number, default: 0 },
    stake: { type: Number, default: 0 },              // amount currently “locked” for interest
    lastStakeUpdated: { type: Date, default: null },                 // last time interest was applied
    AvailableClaim: { type: Number, default: 0 },     // pending interest rewards
  },
  { timestamps: true }  // <-- moved inside as 2nd argument
);

const UserStack = mongoose.model('UserStack', userStackSchema);

export default UserStack;
