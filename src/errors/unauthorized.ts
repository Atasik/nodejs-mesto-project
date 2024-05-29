import { errUnauthorizedCode } from '../constants/status-codes';

class UnatuhorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errUnauthorizedCode;
  }
}

export default UnatuhorizedError;
