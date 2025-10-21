import { Request, Response } from "express";
import {
  createUserService,
  getListUserService,
  verifyUserService,
} from "../services/user.service";
import { responseError, responseSuccess } from "../utils/response";

async function getListUsersController(
  _: Request,
  res: Response
): Promise<void> {
  try {
    const users = await getListUserService();
    responseSuccess(users, res);
  } catch (err: any) {
    responseError(res);
  }
}

async function createUserController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await createUserService(req.body);
    responseSuccess("Create user success", res);
  } catch (err: any) {
    responseError(res);
  }
}

async function verifyUserController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const rs = await verifyUserService(req.body);
    responseSuccess(rs, res);
  } catch (err: any) {
    responseError(res);
  }
}

export { getListUsersController, createUserController, verifyUserController };
