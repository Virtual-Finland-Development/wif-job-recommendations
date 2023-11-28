abstract class BaseException extends Error {
  constructor(message: any, cause?: { cause?: Error } | Error) {
    let errorCause = cause instanceof Error ? cause : cause?.cause;
    if (message instanceof Error) {
      errorCause = errorCause ?? message;
      super(message.message, { cause: errorCause });
    } else {
      super(message, { cause: errorCause });
    }
  }
}

export class ExternalApiRequestException extends BaseException {
  type = "ExternalApiRequestException";
  code = 500;
}

export class BadRequestExcetion extends BaseException {
  type = "BadRequestExcetion";
  code = 400;
}
