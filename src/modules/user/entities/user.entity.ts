import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
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
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => AuthToken, (authToken) => authToken.user)
  authTokens: Promise<AuthToken[]>;
}
