import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/user';
import {
  errServerCode,
  errServer,
  errBadRequestCode,
  errInvalidUserData,
  statusCreatedCode,
  errInvalidUserId,
  errNotFoundCode,
  errUserIdNotFound,
  errInvalidUpdateUserData,
  errInvalidUpdateAvatarData,
} from './errors';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send(users))
  .catch(() => res.status(errServerCode).send({ message: errServer }));

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(errBadRequestCode).send({ message: errInvalidUserData });
  }

  return User.create({ name, about, avatar })
    .then((user) => res.status(statusCreatedCode).send(user))
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(errBadRequestCode).send({ message: errInvalidUserId });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(errNotFoundCode).send({ message: errUserIdNotFound });
      }
      return res.send(user);
    })
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(errBadRequestCode).send({ message: errInvalidUpdateUserData });
  }

  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(errNotFoundCode).send({ message: errUserIdNotFound });
      }
      return res.send(updatedUser);
    })
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(errBadRequestCode).send({ message: errInvalidUpdateAvatarData });
  }

  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(errNotFoundCode).send({ message: errUserIdNotFound });
      }
      return res.send(updatedUser);
    })
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};
