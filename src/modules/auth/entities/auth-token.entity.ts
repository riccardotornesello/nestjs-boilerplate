import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class AuthToken extends BaseEntity {
  @PrimaryColumn()
  tokenHash: string;

  @ManyToOne(() => User, (user) => user.authTokens)
  user: User;
}
