import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getUserData,
} from '../controllers/users';
import {
  getUserValidation,
  updateUserAvatarValidation,
  updateUserValidation,
} from '../validation/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserData);
router.get('/:userId', getUserValidation, getUser);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default router;
