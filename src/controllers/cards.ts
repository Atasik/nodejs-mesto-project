import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Card from '../models/card';
import {
  errInvalidCardData,
  errInvalidCardId,
  errCardIdNotFound,
  errCardForbiddenToDelete,
} from '../constants/errors';
import { statusCreatedCode } from '../constants/status-codes';
import BadRequestError from '../errors/bad-request';
import NotFoundError from '../errors/not-found';
import ForbiddenError from '../errors/forbidden';

export const getCards = (_req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  if (!name || !link) {
    throw new BadRequestError(errInvalidCardData);
  }

  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(statusCreatedCode).send(card))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  if (!Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError(errInvalidCardId);
  }

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errCardIdNotFound);
      }

      if (card.owner.toString() !== req.user?._id) {
        throw new ForbiddenError(errCardForbiddenToDelete);
      }

      return Card.findByIdAndDelete(cardId)
        .then((deletedCard) => {
          if (!deletedCard) {
            throw new NotFoundError(errCardIdNotFound);
          }
          return res.send(deletedCard);
        });
    })
    .catch(next);
};

const updateCardLike = (req: Request, res: Response, next: NextFunction, likeAction: boolean) => {
  const { cardId } = req.params;

  if (!Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError(errInvalidCardId);
  }

  const update = likeAction
    ? { $addToSet: { likes: req.user?._id } }
    : { $pull: { likes: req.user?._id } };

  return Card.findByIdAndUpdate(
    cardId,
    update,
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new NotFoundError(errCardIdNotFound);
      }
      return res.send(updatedCard);
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  updateCardLike(req, res, next, true);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  updateCardLike(req, res, next, false);
};
