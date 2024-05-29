import { model, Schema } from 'mongoose';
import urlRegExp from '../constants/regex';

export interface ICard {
    name: string;
    link: string;
    owner: Schema.Types.ObjectId;
    likes: Schema.Types.ObjectId[];
    createAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: { validator(value: any) { return urlRegExp.test(value); } },
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    default: [],
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default model<ICard>('card', cardSchema);
