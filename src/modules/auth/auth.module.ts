// NestJS
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { AuthController } from './auth.controller';

// Services
import { AuthService } from './auth.service';

// Other modules
import { UserModule } from '../user/user.module';

// Entities
import { AuthToken } from './entities/auth-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken]),
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
