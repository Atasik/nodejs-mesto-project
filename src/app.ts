import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000, MONGO_URI = 'mongodb://localhost:27017/mestodb'} = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6653f525057929a900300b89' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
}); 

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log("server is listening on port", PORT)
});