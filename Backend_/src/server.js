import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB.js"
import userRouter from "./routes/authRoutes.js";
import cors from "cors";
import stackRouter from "./routes/stackRoutes.js";

dotenv.config()
const app = express();
connectDB(process.env.MONGO_URL)
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4545;

app.use("/api/auth", userRouter);
app.use("/api/stack", stackRouter);




app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
});