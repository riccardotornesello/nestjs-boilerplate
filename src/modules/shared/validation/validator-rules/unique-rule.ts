import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import type {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UniqueRule implements ValidatorConstraintInterface {
  constructor(private readonly em: EntityManager) {}

  async validate(value: string, args: any) {
    const [entity, field] = args.constraints;
    const foundCount = await this.em
      .getRepository(entity)
      .count({ [field]: value });
    return foundCount === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `Value ${args.value} already exists`;
  }
}
