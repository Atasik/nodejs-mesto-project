import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errors } from 'celebrate';
import error from './middlewares/error';
import auth from './middlewares/auth';
import { createUserValidation, loginValidation } from './validation/user';
import { createUser, login } from './controllers/users';

const { PORT = 3000, MONGO_URI = 'mongodb://localhost:27017/mestodb'} = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI);

app.use(requestLogger);

app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth)

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors())

app.use(error)

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log("server is listening on port", PORT)
});