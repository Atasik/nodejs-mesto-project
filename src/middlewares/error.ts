import { NextFunction, Request, Response } from 'express';
import { errServerCode } from '../constants/status-codes';
import { errServer } from '../constants/errors';
import { CustomError } from '../types/error';

const error = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = errServerCode, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === errServerCode
        ? errServer
        : message,
    });
  next();
};

export default error;
