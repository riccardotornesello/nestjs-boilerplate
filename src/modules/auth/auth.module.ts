// NestJS
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Other modules
import { UserModule } from '../user/user.module';
// Controllers
import { AuthController } from './auth.controller';
// Services
import { AuthService } from './auth.service';
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
