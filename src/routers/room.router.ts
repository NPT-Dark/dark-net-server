import { createRoomController, getRoomController } from "../controllers/room.controller";
import { Router } from "express";
const roomRouter = Router();

roomRouter.get("/", getRoomController);
roomRouter.post("/", createRoomController);

export default roomRouter;
