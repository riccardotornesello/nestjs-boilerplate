import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { UserPermission, UserRole } from '../../../constants';
import { AuthToken } from '../../auth/entities/auth-token.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserPermission, array: true, default: [] })
  permissions: UserPermission[];

  @OneToMany(() => AuthToken, (authToken) => authToken.user)
  authTokens: Promise<AuthToken[]>;

  hasRoleIn(roles: UserRole[]): boolean {
    return roles.includes(this.role);
  }

  hasPermission(permission: UserPermission): boolean {
    return this.permissions.includes(permission);
  }
}
