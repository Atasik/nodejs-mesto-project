import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Card from '../models/card';
import {
  errServerCode,
  errServer,
  errBadRequestCode,
  errInvalidCardData,
  statusCreatedCode,
  errInvalidCardId,
  errNotFoundCode,
  errCardIdNotFound,
} from './errors';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(errServerCode).send({ message: errServer }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(errBadRequestCode).send({ message: errInvalidCardData });
  }

  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(statusCreatedCode).send(card))
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  if (!Types.ObjectId.isValid(cardId)) {
    return res.status(errBadRequestCode).send({ message: errInvalidCardId });
  }

  return Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(errNotFoundCode).send({ message: errCardIdNotFound });
      }
      return res.send(deletedCard);
    })
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  if (!Types.ObjectId.isValid(cardId)) {
    return res.status(errBadRequestCode).send({ message: errInvalidCardId });
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(errNotFoundCode).send({ message: errCardIdNotFound });
      }
      return res.send(updatedCard);
    })
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  if (!Types.ObjectId.isValid(cardId)) {
    return res.status(errBadRequestCode).send({ message: errInvalidCardId });
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(errNotFoundCode).send({ message: errCardIdNotFound });
      }
      return res.send(updatedCard);
    })
    .catch(() => res.status(errServerCode).send({ message: errServer }));
};
