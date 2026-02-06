import express from "express";
import {
  createStack,
  stacked,
  getStack,
  addReward,
  claimRewards,
  updateBalance,
  deleteStack,
  getStackedUser,
} from "../controllers/stackController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";

const stackRouter = express.Router();


stackRouter.post("/add/:userId", createStack);

stackRouter.post("/stake/:userId", authMiddleware, allowRoles("user"), stacked);

stackRouter.get("/get/:userId", authMiddleware, allowRoles("user"),getStack);

stackRouter.post("/add-reward", addReward);

stackRouter.post("/claim/:userId", claimRewards);

stackRouter.put("/update-balance", updateBalance)

stackRouter.delete("/delete/:userId", authMiddleware,allowRoles("admin"),deleteStack);

stackRouter.get("/admin/staked-users", authMiddleware,allowRoles("admin"),getStackedUser);

export default stackRouter;


// // OPTIONAL: explicit stake route
// router.post("/stack/stake", stakeHC);
