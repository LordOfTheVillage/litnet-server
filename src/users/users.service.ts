import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';
import { PatchUserDto } from './dto/patch-user.dto';
import { Contest } from 'src/contest/models/contest.model';
import { Comment } from 'src/comment/comment.model';
import { Book } from 'src/books/books.model';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { PaginationQueryParams } from 'src/types/types';
import { PatchUserPasswordDto } from './dto/patch-user-password.dto';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.model';
import { BanUserDto } from './dto/ban-user.dto';
import { AddRoleDto } from './dto/add-role.dto';

@Injectable()
export class UsersService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FileService,
    private roleService: RoleService,
  ) {}

  async createUser(dto: CreateUserDto, img?: any) {
    const suspectUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    this.checkExistingUser(suspectUser);
    const fileName = img ? await this.fileService.createFile(img) : null;
    const role = await this.roleService.getRoleByValue('USER');
    const user = await this.userRepository.create({
      ...dto,
      img: fileName,
      roleId: role.id,
    });
    await user.$set('role', role);
    return user;
  }

  async getAllUsers({
    limit = UsersService.DEFAULT_LIMIT,
    offset = UsersService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const users = await this.userRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
      include: { model: Role, attributes: ['value'] },
    });
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: [
        { model: Comment, attributes: ['id'] },
        { model: Contest, attributes: ['id'] },
        { model: Book, attributes: ['id'] },
        { model: Bookmark },
        { model: Role, attributes: ['value'] },
      ],
    });
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

  async updatePassword(dto: PatchUserPasswordDto, id: number) {
    const user = await this.userRepository.findByPk(id);
    this.validateUser(user);
    const updatedUser = await user.update({ ...dto });
    return updatedUser;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    this.validateUser(user);
    await user.destroy();
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$set('role', role.id);
      return dto;
    }
    throw new NotFoundException('User or role not found');
  }

  async banUser(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId, {
      include: { model: Role },
    });
    this.validateUser(user);

    if (user.role.value === 'ADMIN') {
      throw new MethodNotAllowedException('User has an admin role');
    }

    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }

  private checkExistingUser(user: User) {
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }

  private validateUser(user: User) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private async getUserByProperty(property: string, value: string) {
    const user = await this.userRepository.findOne({
      where: { [property]: value },
      include: [
        { model: Comment, attributes: ['id'] },
        { model: Contest, attributes: ['id'] },
        { model: Book, attributes: ['id'] },
        { model: Bookmark },
        { model: Role, attributes: ['value'] },
      ],
    });
    return user;
  }
}
