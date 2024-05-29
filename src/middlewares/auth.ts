import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../constants/jwt';
import { errUnauthorizedUser } from '../constants/errors';
import { errUnauthorizedCode } from '../constants/status-codes';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(errUnauthorizedCode)
      .send({ message: errUnauthorizedUser });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(errUnauthorizedCode)
      .send({ message: errUnauthorizedUser });
  }

  req.user = payload as {_id: string}; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};

export default auth;
