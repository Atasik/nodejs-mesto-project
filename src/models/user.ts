import { model, Schema } from 'mongoose';
import validator from 'validator';
import urlRegExp from '../constants/regex';

export interface IUser {
    name: string;
    about: string;
    avatar: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: { validator(value: any) { return urlRegExp.test(value); } },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    validate: { validator(value: any) { return validator.isEmail(value); } },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

export default model<IUser>('user', userSchema);
