import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../constants/jwt';
import User from '../models/user';

import {
  errInvalidUserData,
  errInvalidUserId,
  errUserIdNotFound,
  errInvalidUpdateUserData,
  errInvalidUpdateAvatarData,
  errWrongUserData,
  errEmailExists,
} from '../constants/errors';
import { statusCreatedCode } from '../constants/status-codes';
import UnatuhorizedError from '../errors/unauthorized';
import BadRequestError from '../errors/bad-request';
import NotFoundError from '../errors/not-found';
import ConflictError from '../errors/conflict';

const tokenTTL = 1000 * 60 * 60 * 24 * 7; // 7 дней

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(errInvalidUserData);
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnatuhorizedError(errWrongUserData);
      }

      bcrypt.compare(password, user.password)
        .then((isPasswordCorrect) => {
          if (!isPasswordCorrect) {
            throw new UnatuhorizedError(errWrongUserData);
          }

          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

          res.cookie('token', token, {
            httpOnly: true,
            maxAge: tokenTTL,
          });

          return res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

export const getUserData = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new NotFoundError(errUserIdNotFound);
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errUserIdNotFound);
      }
      return res.send(user);
    })
    .catch(next);
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError(errInvalidUserData);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  return User.create({
    name, about, avatar, email, password: hashedPassword,
  })
    .then((user) => res.status(statusCreatedCode).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(errEmailExists));
      }
      return next(err);
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestError(errInvalidUserId);
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errUserIdNotFound);
      }
      return res.send(user);
    })
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  if (!name || !about) {
    throw new BadRequestError(errInvalidUpdateUserData);
  }

  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError(errUserIdNotFound);
      }
      return res.send(updatedUser);
    })
    .catch(next);
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new BadRequestError(errInvalidUpdateAvatarData);
  }

  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError(errUserIdNotFound);
      }
      return res.send(updatedUser);
    })
    .catch(next);
};
