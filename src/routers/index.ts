import { Router } from "express";
import userRouter from "./user.router";
import roomRouter from "./room.router";

export const routers = Router();

// 🛡️ User Router
routers.use("/user", userRouter);

// 🏠 Room Router
routers.use("/room", roomRouter);