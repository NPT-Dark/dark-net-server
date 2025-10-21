import { CallbackStatusEnum, ResActionStatusEnum } from "../types/resAction";
import { Response } from "express";
export const responseSuccess = <T>(result: T, res: Response): Response => {
  return res.status(ResActionStatusEnum.SUCCESS).json(result);
};

export const responseValidation = (res: Response): Response => {
  return res
    .status(ResActionStatusEnum.ERR_VALIDATION)
    .json("Validation error");
};

export const responseError = (res: Response) => {
  if (!res.headersSent) {
    return res
      .status(ResActionStatusEnum.ERR_SERVER)
      .json("Internal server error");
  }
};

export const callbackSuccess = <T>(result: T) => {
  return {
    status: CallbackStatusEnum.SUCCESS,
    data: result,
  };
}

export const callbackError = (errorMessage: string) => {
  return {
    status: CallbackStatusEnum.ERROR,
    message: errorMessage,
  };
}