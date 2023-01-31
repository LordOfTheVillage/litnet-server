import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserByEmail(email: string) {
    return this.getUserByProperty('email', email);
  }

  async getUserByName(name: string) {
    return this.getUserByProperty('name', name);
  }

  private async getUserByProperty(property: string, value: string) {
    const user = await this.userRepository.findOne({
      where: { [property]: value },
    });
    return user;
  }
}
