import { UnauthorizedException } from '@nestjs/common';

export class MissingTokenException extends UnauthorizedException {
  constructor() {
    super('error.missingToken');
  }
}
