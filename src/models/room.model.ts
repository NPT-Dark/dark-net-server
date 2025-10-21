import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

export interface IRoom {
  hostCallId: string; // id user tạo cuộc gọi
  receiverIds: string[];
  status?: "pending" | "answered" | "missed" | "ended";
  isVideoCall?: boolean;
  startedAt?: Date;
  endedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


const RoomSchema = new mongoose.Schema({
  hostCallId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  status: {
    type: String,
    enum: ["pending", "answered", "missed", "ended"],
    default: "pending",
  },
  isVideoCall: { type: Boolean, default: true },
  startedAt: Date,
  endedAt: Date,
});

export const RoomModel: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

