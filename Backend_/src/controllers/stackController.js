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



const getStack = async (req, res) => {
  try {
    const { userId } = req.params;

    const stack = await UserStack.findOne({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user",
      });
    }

    res.status(200).json({stack});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const addReward = async (req, res) => {
  try {
    const { userId, amount, rewardType = "cash" } = req.body;

    const stack = await UserStack.findOne({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user"
      });
    }

    
    stack.rewards.push({
      time: Date.now(), 
      amount,
    });

    stack.unclaimedRewards += amount;

    await stack.save();

    res.status(200).json({
      message: "Reward added",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
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
        message: "No stack found for this user"
      });
    }

    if (stack.unclaimedRewards <= 0) {
      return res.status(400).json({
        message: "No rewards to claim",
      });
    }
    
    
    const rewardsToClaim = stack.unclaimedRewards;
    
    stack.balance += stack.unclaimedRewards;
    stack.claimedRewards += rewardsToClaim;
    stack.totalEarned += rewardsToClaim;
    stack.unclaimedRewards = 0;

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
        message: "New balance amount must be greater than 0",
      });
    }

    const stack = await UserStack.findOne({ userId });
    if (!stack) {
      return res.status(404).json({
        message: "No stack found for this user",
      });
    }

    // ✅ ADD to existing balance
    stack.balance += newBalance;

    await stack.save();

    res.status(200).json({
      message: "Balance added successfully",
      previousBalance: stack.balance - newBalance,
      addedAmount: newBalance,
      currentBalance: stack.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
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
        success: false,
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
  getStack,
  addReward,
  claimRewards,
  updateBalance,
  deleteStack,
  getStackedUser,
};
