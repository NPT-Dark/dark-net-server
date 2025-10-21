import { IUser, UserModel } from "../models/user.model";
import { compareCode, hashCode } from "../utils/secret";

async function createUserService(user: IUser) {
  try {
    const hashPassword = await hashCode(user.password);
    const userCreate: IUser = { ...user, password: hashPassword };
    const rs = await UserModel.create(userCreate);
    if (!rs) return null;
    return rs;
  } catch (err: unknown) {
    console.log("Create user error:", err);
    return null;
  }
}

async function verifyUserService(user: {
  email?: string;
  password?: string;
  username?: string;
}) {
  try {
    const { email, password, username } = user;
    if (!email && !password && !username) return null;
    if (email) {
      const rs = await UserModel.findOne({ email });
      if (!rs) return null;
      return rs;
    }
    if (username && password) {
      const rs = await UserModel.findOne({ username });
      if (!rs) return null;
      const valid = await compareCode(password, rs.password);
      if (!valid) return null;
      return rs;
    }
    return null;
  } catch (err: unknown) {
    console.log("Login error:", err);
    return null;
  }
}

async function getListUserService() {
  try {
    const rs = await UserModel.find({}, { password: 0 });
    if (!rs) return [];
    return rs;
  } catch (err: unknown) {
    console.log("Get list user error:", err);
    return [];
  }
}

export { createUserService, verifyUserService, getListUserService };
