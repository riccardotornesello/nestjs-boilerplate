import { PrimaryKey, Property, types } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Property({ type: types.datetime })
  createdAt = new Date();

  @Property({ type: types.datetime, onUpdate: () => new Date() })
  updatedAt = new Date();
}
