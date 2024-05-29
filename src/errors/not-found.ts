import { errNotFoundCode } from '../constants/status-codes';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errNotFoundCode;
  }
}

export default NotFoundError;
