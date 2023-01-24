import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

import { UserPermission, UserRole } from '../../../../constants';
import { BaseEntity } from '../../../../utils/base.entity';
import { AuthToken } from '../../auth/entities/auth-token.entity';
import { EmailVerification } from '../../auth/entities/email-verification.entity';

@Entity()
export class User extends BaseEntity {
  @Property({
    unique: true,
  })
  username: string;

  @Property({
    unique: true,
  })
  email: string;

  @Property()
  @Exclude()
  passwordHash: string;

  @Property({ default: true })
  isActive: boolean;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole;

  @Enum({ items: () => UserPermission, array: true, default: [] })
  permissions: UserPermission[];

  @Exclude()
  @OneToMany({
    entity: () => AuthToken,
    mappedBy: (authToken) => authToken.user,
  })
  authTokens = new Collection<AuthToken>(this);

  @OneToOne(
    () => EmailVerification,
    (emailVerification) => emailVerification.user,
    { cascade: [Cascade.ALL] },
  )
  emailVerification?: EmailVerification;

  hasRoleIn(roles: UserRole[]): boolean {
    return roles.includes(this.role);
  }

  hasPermission(permission: UserPermission): boolean {
    return this.permissions.includes(permission);
  }
}
