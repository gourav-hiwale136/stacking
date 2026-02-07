import express from "express";
import {
  createStack,
  stacked,
  getStack,
  claimRewards,
  addBalance,
  deleteStack,
  getStackedUser,
  withdraw
} from "../controllers/stackController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";

const stackRouter = express.Router();


stackRouter.post("/add/:userId", createStack);

stackRouter.post("/stake", authMiddleware, allowRoles("user"), stacked);

stackRouter.get("/get/:userId", authMiddleware, allowRoles("user"),getStack);

stackRouter.post("/claim/:userId", claimRewards);

stackRouter.put("/update-balance",authMiddleware, allowRoles("user"), addBalance);

stackRouter.delete("/delete/:userId", authMiddleware,allowRoles("admin"),deleteStack);

stackRouter.get("/admin/staked-users", authMiddleware,allowRoles("admin"),getStackedUser);

stackRouter.post("/withdraw", authMiddleware, allowRoles("user"), withdraw);

export default stackRouter;



