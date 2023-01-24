import type { EntityName } from '@mikro-orm/core';
import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

import { UniqueRule } from '../validator-rules/unique-rule';

export function Unique(
  entity: EntityName<object>,
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
