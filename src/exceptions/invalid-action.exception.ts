import { ForbiddenException } from '@nestjs/common';

export class InvalidActionException extends ForbiddenException {
  constructor() {
    super('error.invalidAction');
  }
}
