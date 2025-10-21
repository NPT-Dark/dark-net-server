import { z } from "zod";
import { Request, Response } from "express";
import {
  responseError,
  responseSuccess,
  responseValidation,
} from "../utils/response";
import { createRoomService, getRoomService } from "../services/room.service";

const createRoomSchema = z.object({
  hostId: z.string(),
  receiverIds: z.array(z.string()),
  isVideoCall: z.boolean().optional(),
});
async function getRoomController(req: Request, res: Response) {
  try {
    const roomId = req.query.roomId;
    const room = await getRoomService(roomId as string);
    if (room) {
      return responseSuccess(room, res);
    }
    return responseError(res);
  } catch (err) {
    console.error("❌ Error getting room:", err);
    return responseError(res);
  }
}

async function createRoomController(req: Request, res: Response) {
  try {
    const parsed = createRoomSchema.safeParse(req.body);

    if (!parsed.success) {
      responseValidation(res);
    }

    if (!parsed || !parsed.data) return responseError(res);

    const { hostId, receiverIds, isVideoCall } = parsed.data;

    const roomCreated = await createRoomService({
      hostId,
      receiverIds,
      isVideoCall,
      res,
    });
    return responseSuccess(roomCreated, res);
  } catch (err) {
    console.error("❌ Error creating room:", err);
    return responseError(res);
  }
}

export { createRoomController, getRoomController };
