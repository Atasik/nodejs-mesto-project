import { Router } from 'express';
import {
  likeCard, dislikeCard, deleteCard, createCard, getCards,
} from '../controllers/cards';
import auth from '../middlewares/auth';
import {
  createCardValidation, deleteCardValidation, dislikeCardValidation, likeCardValidation,
} from '../validation/card';

const router = Router();

router.use(auth);

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', deleteCardValidation, deleteCard);
router.put('/:cardId/likes', likeCardValidation, likeCard);
router.delete('/:cardId/likes', dislikeCardValidation, dislikeCard);

export default router;
