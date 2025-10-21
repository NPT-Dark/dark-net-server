import { Types } from "mongoose";
import { RoomModel } from "../models/room.model";
import { responseError, responseSuccess } from "../utils/response";
import { Response } from "express";

async function createRoomService({
  hostId,
  receiverIds,
  isVideoCall = true,
}: {
  hostId: string;
  receiverIds: string[];
  isVideoCall?: boolean;
  res: Response;
}) {
  try {
    const roomCreated = await RoomModel.create({
      hostCallId: new Types.ObjectId(hostId),
      receiverIds: [...receiverIds].map((id) => new Types.ObjectId(id)),
      isVideoCall,
      status: "pending",
    });
    return roomCreated
  } catch (err: unknown) {
    console.error("Create room service error:", err);
    return null;
  }
}

// Join room
async function joinRoomService(roomId: string, userId: string, res: Response) {
  try {
    await RoomModel.updateOne(
      { roomId },
      {
        $addToSet: { participantIds: new Types.ObjectId(userId) },
        $set: { status: "active" },
      }
    );
    return responseSuccess("Joined room", res);
  } catch (err) {
    console.error("Join room error:", err);
    return responseError(res);
  }
}

// Leave room
async function leaveRoomService(roomId: string, userId: string, res: Response) {
  try {
    await RoomModel.updateOne(
      { roomId },
      {
        $pull: { participantIds: new Types.ObjectId(userId) },
      }
    );
    return responseSuccess("Left room", res);
  } catch (err) {
    console.error("Leave room error:", err);
    return responseError(res);
  }
}

// Kết thúc room
async function endRoomService(roomId: string, res: Response) {
  try {
    await RoomModel.updateOne(
      { roomId },
      {
        $set: {
          status: "ended",
          endedAt: new Date(),
        },
      }
    );
    return responseSuccess("Ended room", res);
  } catch (err) {
    console.error("End room error:", err);
    return responseError(res);
  }
}

async function getRoomService(roomId: string) {
  try {
    const room = await RoomModel.findOne({ _id: new Types.ObjectId(roomId) });
    if (!room) return null;
    return room;
  } catch (err) {
    console.error("Get room error:", err);
    return null;
  }
}

export {
  createRoomService,
  joinRoomService,
  leaveRoomService,
  endRoomService,
  getRoomService,
};
