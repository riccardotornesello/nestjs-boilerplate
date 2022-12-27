import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
