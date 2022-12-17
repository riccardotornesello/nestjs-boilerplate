import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import type { EntityTarget, BaseEntity } from 'typeorm';

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

export function Unique(
  entity: EntityTarget<BaseEntity>,
  field: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: UniqueRule,
    });
  };
}
