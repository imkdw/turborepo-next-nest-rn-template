import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../filter/custom.exception';
import { EXCEPTION_CODES } from '@repo/exception';

export class TodoNotFoundException extends CustomException {
  constructor(message: string) {
    super({
      message,
      errorCode: EXCEPTION_CODES.TODO_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}
