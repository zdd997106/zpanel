export default class CustomError extends Error {
  constructor(
    message: string,
    private readonly reasonCode: ErrorReasonCode,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  static createUserCancelledError(message = 'User cancelled the operation') {
    return new CustomError(message, ErrorReasonCode.USER_CANCELLED);
  }

  static isUserCancelledError(error: Error): boolean {
    return error instanceof CustomError && error.reasonCode === ErrorReasonCode.USER_CANCELLED;
  }
}

// ----- TYPES -----

enum ErrorReasonCode {
  USER_CANCELLED = 'USER_CANCELLED',
}
