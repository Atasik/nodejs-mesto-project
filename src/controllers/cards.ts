import { Request, Response } from 'express';
import Card from '../models/card'

export const likeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
//   req.params.cardId,
//   { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//   { new: true },
)
  
export const dislikeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
//   req.params.cardId,
//   { $pull: { likes: req.user._id } }, // убрать _id из массива
//   { new: true },
)

export const deleteCard = (req: Request, res: Response) => {

}

export const createCard = (req: Request, res: Response) => {
    const { name, link } = req.body;

    return Card.create({ name, link})
        .then(card => res.send({ data: card }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const getCards = (req: Request, res: Response) => {
    return Card.find({})
      .populate('card')
      .then(cards => res.send({ data: cards }))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}