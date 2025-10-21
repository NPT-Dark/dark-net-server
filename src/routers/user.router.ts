import { Router } from "express";
const userRouter = Router();

import {
    createUserController,
    getListUsersController,
    verifyUserController,
} from "../controllers/user.controller";

userRouter.post("/", createUserController);
userRouter.get("/get-list", getListUsersController);
userRouter.post("/verify", verifyUserController);

export default userRouter;
