import { errBadRequestCode } from '../constants/status-codes';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errBadRequestCode;
  }
}

export default BadRequestError;
