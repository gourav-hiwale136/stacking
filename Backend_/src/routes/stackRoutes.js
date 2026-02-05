import express from "express";
import {
  createStack,
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


stackRouter.post("/create", createStack);

stackRouter.get("/:userId", getStack);

stackRouter.post("/add-reward", addReward);

stackRouter.post("/claim", claimRewards);

stackRouter.put("/update-balance", updateBalance)

stackRouter.delete("/delete/:userId", authMiddleware,allowRoles("admin"),deleteStack);

stackRouter.get("/admin/stacked-users", authMiddleware,allowRoles("admin"),getStackedUser);

export default stackRouter;
