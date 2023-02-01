import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FileService,
  ) {}

  async createUser(dto: CreateUserDto, img?: any) {
    const fileName = await this.fileService.createFile(img);
    const user = await this.userRepository.create({ ...dto, img: fileName });
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
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
