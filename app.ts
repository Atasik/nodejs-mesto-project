import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './src/routes/users';
import cardsRouter from './src/routes/cards';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mynewdb');

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.user = {
//     _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// }); 

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});