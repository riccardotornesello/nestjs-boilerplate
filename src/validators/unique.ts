import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import type { BaseEntity, EntityTarget } from 'typeorm';

import { UniqueRule } from '../shared/validator-rules/unique-rule';

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
