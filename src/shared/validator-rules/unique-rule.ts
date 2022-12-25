import { Injectable } from '@nestjs/common';
import type {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidatorConstraint } from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UniqueRule implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, args: any) {
    const [entity, field] = args.constraints;
    return (
      (await this.dataSource.getRepository(entity).count({
        where: { [field]: value },
      })) <= 0
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `Value ${args.value} already exists`;
  }
}
