import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';
import { PatchUserDto } from './dto/patch-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FileService,
  ) {}

  async createUser(dto: CreateUserDto, img?: any) {
    const suspectUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    await this.checkExistingUser(suspectUser);
    const fileName = img ? await this.fileService.createFile(img) : null;
    const user = await this.userRepository.create({ ...dto, img: fileName });
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id);
    return user;
  }

  async getUserByEmail(email: string) {
    return this.getUserByProperty('email', email);
  }

  async getAvatar(id: number) {
    const user = await this.userRepository.findByPk(id);
    return user.img;
  }

  async updateAvatar(id: number, img: any) {
    const user = await this.userRepository.findByPk(id);
    this.validateUser(user);
    const fileName = await this.fileService.createFile(img);
    const updatedUser = await user.update({ img: fileName });
    return updatedUser;
  }

  async getUserByName(name: string) {
    return this.getUserByProperty('name', name);
  }

  async updateUser(dto: PatchUserDto, id: number, img?: any) {
    const user = await this.userRepository.findByPk(id);
    this.validateUser(user);
    const fileName = img ? await this.fileService.createFile(img) : user.img;
    const updatedUser = await user.update({ ...dto, img: fileName });
    return updatedUser;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    this.validateUser(user);
    await user.destroy();
    return user;
  }

  private async checkExistingUser(user: User) {
    if (user) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateUser(user: User) {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  private async getUserByProperty(property: string, value: string) {
    const user = await this.userRepository.findOne({
      where: { [property]: value },
    });
    return user;
  }
}
