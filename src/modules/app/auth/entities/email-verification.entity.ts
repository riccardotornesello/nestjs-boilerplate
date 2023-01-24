import { Entity, OneToOne, Property, types } from '@mikro-orm/core';

import { User } from '../../user/entities/user.entity';

@Entity()
export class EmailVerification {
  @OneToOne(() => User, { primary: true })
  user: User;

  @Property({ type: types.datetime, nullable: true })
  verifiedAt?: Date;

  @Property({
    type: types.datetime,
    nullable: true,
  })
  lastSent?: Date;
}
