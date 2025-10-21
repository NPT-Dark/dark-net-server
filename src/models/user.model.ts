import mongoose, { Model } from "mongoose";

export interface IUser extends Document {
  displayName?: string | null;
  bio?: string | null;
  username?: string;
  password?: string | null;
  email?: string;
  profileImage?: string | null;
  backgroundImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    default: null,
  },
  email: {
    type: String,
  },
  profileImage: {
    type: String,
    default: null,
  },
  backgroundImage: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.index(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: { username: { $exists: true, $type: "string" } },
  }
);
UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $exists: true, $type: "string" } },
  }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
