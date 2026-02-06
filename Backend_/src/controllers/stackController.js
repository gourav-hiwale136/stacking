import UserStack from "../models/stackModel.js";


const createStack = async (req, res) => {
  try {
    const { userId, balance } = req.body;

    // 1️⃣ Check first
    const existingStack = await UserStack.findOne({ userId });
    if (existingStack) {
      return res.status(400).json({
        message: "User already has a stack"
      });
    }

    // 2️⃣ Create
    const stack = await UserStack.create({
  userId,
  balance: balance ?? 100,
  stake: 0, // 👈 auto‑stake all balance
  lastStakeUpdated: null // 👈 start interest timer
});


    res.status(201).json({
      message: "Stack created successfully",
      stack,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const stacked = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const stack = await UserStack.findOne({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user",
      });
    }

    const { amount: interest, newLastStakeUpdated } = ApplyInterest(stack);
    if (interest > 0) {
      stack.AvailableClaim += interest;
      stack.lastStakeUpdated = newLastStakeUpdated;
    }

    stack.stake += amount;
    stack.balance -= amount;
    stack.lastStakeUpdated = new Date();

    await stack.save();

    res.status(200).json({
      message: "Stake placed successfully",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const ApplyInterest = (stack) => {
  if (!stack.stake || !stack.lastStakeUpdated) {
    if (!stack.stake) return { message: "Stake not added", amount: 0 };
    if (!stack.lastStakeUpdated) return { message: "Interval not completed", amount: 0 };
  }

  const now = new Date();
  const last = new Date(stack.lastStakeUpdated);
  const diff = now - last;
  const time = 10 * 60 * 1000; // 10 minutes in ms
  const intervals = Math.floor(diff / time);

  if (intervals <= 0) {
    return { message: "Interval not completed", amount: 0 };
  }

  const total_interest = (stack.stake || 0) * 0.01 * intervals;
  return {
    message: `${total_interest} added to AvailableClaim`,
    amount: total_interest,
    newLastStakeUpdated: new Date(last.getTime() + time * intervals),
  };
};




const getStack = async (req, res) => {
  try {
    const { userId } = req.params;

    const stack = await UserStack.findOne({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user",
      });
    }

    // 👇 apply pending interest before returning
    const { amount, newLastStakeUpdated } = ApplyInterest(stack);
    if (amount > 0) {
      stack.AvailableClaim += amount;
      stack.lastStakeUpdated = newLastStakeUpdated;
      await stack.save();
    }

    res.status(200).json({ stack });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// 4. Claim rewards (user clicks “Claim”)
const claimRewards = async (req, res) => {
  try {
    const { userId } = req.body;

    const stack = await UserStack.findOne({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user",
      });
    }

    // 👇 apply pending interest first
    const { amount: interest, newLastStakeUpdated } = ApplyInterest(stack);
    if (interest > 0) {
      stack.AvailableClaim += interest;
      stack.lastStakeUpdated = newLastStakeUpdated;
    }

    
    if (stack.AvailableClaim <= 0) {
      return res.status(400).json({
        message: "No rewards to claim",
      });
    }
    const rewardsToClaim = (stack.AvailableClaim || 0);
    
    stack.balance += rewardsToClaim;
    stack.claimedRewards += rewardsToClaim;
    stack.totalEarned += rewardsToClaim;
    stack.AvailableClaim = 0;

    await stack.save();

    res.status(200).json({
      message: "Rewards claimed",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// 5. Update balance (for example, when user stakes more money)
const updateBalance = async (req, res) => {
  try {
    const { userId, newBalance } = req.body;

    if (!newBalance || newBalance <= 0) {
      return res.status(400).json({
        message: "New balance",
      });
    }

    const stack = await UserStack.findOne({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user",
      });
    }

    // 👇 apply pending interest before changing stake
    const { amount: interest, newLastStakeUpdated } = ApplyInterest(stack);
    if (interest > 0) {
      stack.AvailableClaim += interest;
      stack.lastStakeUpdated = newLastStakeUpdated;
    }

    // 👇 treat newBalance as additional stake
    stack.stake += newBalance;
    stack.balance += newBalance;

    stack.lastStakeUpdated = new Date(); // reset timer

    await stack.save();

    res.status(200).json({
      message: "Balance and stake updated successfully",
      previousStake: stack.stake - newBalance,
      addedAmount: newBalance,
      currentStake: stack.stake,
      currentBalance: stack.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const deleteStack = async (req, res) => {
  try {
    const { userId } = req.params;

    const stack = await UserStack.findOneAndDelete({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user"
      });
    }

    res.status(200).json({
      message: "Stack deleted successfully",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

 const getStackedUser = async (req, res) => {
  try {
    const stackedUsers = await UserStack.find()
      .populate("userId", "username email role");

    if (!stackedUsers || stackedUsers.length === 0) {
      return res.status(404).json({
        message: "No stacked users found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stacked users fetched successfully",
      totalUsers: stackedUsers.length,
      stackedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export {
  createStack,
  stacked,
  ApplyInterest,
  getStack,
  claimRewards,
  updateBalance,
  deleteStack,
  getStackedUser,
};
