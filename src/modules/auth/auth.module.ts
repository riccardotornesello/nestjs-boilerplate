import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthToken } from './entities/auth-token.entity';
import { HttpBearerStrategy } from './strategies/http-bearer.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken]), ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, HttpBearerStrategy],
})
export class AuthModule {}
