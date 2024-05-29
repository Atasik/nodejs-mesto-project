import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUserData,
} from '../controllers/users';
import auth from '../middlewares/auth';
import {
  createUserValidation,
  getUserValidation,
  loginValidation,
  updateUserAvatarValidation,
  updateUserValidation,
} from '../validation/user';

const router = Router();

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.get('/', getUsers);
router.get('/me', getUserData);
router.get('/:userId', getUserValidation, getUser);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default router;
