import { errInvalidUrl } from '../constants/errors';
import urlRegExp from '../constants/regex';

const isURLValidator = (value: string) => {
  const res = urlRegExp.test(value);
  if (res) {
    return value;
  }
  throw new Error(errInvalidUrl);
};

export default isURLValidator;
