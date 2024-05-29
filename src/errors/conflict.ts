import { errConflictCode } from '../constants/status-codes';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errConflictCode;
  }
}

export default ConflictError;
