import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere, DeepPartial } from 'typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOne(findData: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOneBy(findData);
  }

  getByUsername(username: string): Promise<User | null> {
    return this.findOne({
      username,
    });
  }

  getByEmail(email: string): Promise<User | null> {
    return this.findOne({
      email,
    });
  }

  createOne(userData: DeepPartial<User>): Promise<User> {
    return this.userRepository.save(userData);
  }
}
