import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { UniqueRule } from 'src/shared/validator-rules/unique-rule';
import type { BaseEntity, EntityTarget } from 'typeorm';

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
