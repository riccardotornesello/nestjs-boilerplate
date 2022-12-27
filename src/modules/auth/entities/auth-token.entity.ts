import { Entity, LoadStrategy, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class AuthToken extends BaseEntity {
  @Property()
  tokenHash: string;

  @ManyToOne({
    entity: () => User,
    strategy: LoadStrategy.JOINED,
    eager: true,
  })
  user: User;
}
