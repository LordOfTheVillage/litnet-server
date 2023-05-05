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
import { BookComment } from 'src/comment/comment.model';
import { Book } from 'src/books/books.model';
import { Bookmark } from 'src/bookmark/bookmark.model';
import {
  VerifiedParams,
  PaginationQueryParams,
  BookQueryParams,
} from 'src/types/types';
import { PatchUserPasswordDto } from './dto/patch-user-password.dto';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.model';
import { BanUserDto } from './dto/ban-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { Op } from 'sequelize';
import { CommentService } from 'src/comment/comment.service';
import { BooksService } from 'src/books/books.service';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { BlogCommentService } from 'src/blog-comment/blog-comment.service';
import { BlogService } from 'src/blog/blog.service';
import { ContestCommentService } from 'src/contest-comment/contest-comment.service';
import { ContestService } from 'src/contest/contest.service';
import { RatingService } from 'src/rating/rating.service';
import { RoleNames } from 'src/constants';
import { ProducerApplication } from 'src/producer-application/producer-application.model';

@Injectable()
export class UsersService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FileService,
    private roleService: RoleService,
    private bookCommentsService: CommentService,
    private blogCommentsService: BlogCommentService,
    private contestCommentsService: ContestCommentService,
    private bookService: BooksService,
    private bookmarkService: BookmarkService,
    private blogService: BlogService,
    private ratingService: RatingService,
  ) {}

  async createUser(dto: CreateUserDto, img?: any) {
    const suspectUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    this.checkExistingUser(suspectUser);
    const fileName = img ? await this.fileService.createFile(img) : null;
    const role = await this.roleService.getRoleByValue(RoleNames.USER);
    const user = await this.userRepository.create({
      ...dto,
      img: fileName,
      roleId: role.id,
    });
    return await this.getUserById(user.id);
  }

  async getAllUsers({
    limit = UsersService.DEFAULT_LIMIT,
    offset = UsersService.DEFAULT_OFFSET,
    disabled: banned = false,
    search: name = '',
    role = 'all',
  }: VerifiedParams) {
    let roles = await this.roleService.getAllRoles();
    if (role !== 'all') roles = roles.filter((r) => r.value === role);
    const range = roles.map((r) => r.id);
    const users = await this.userRepository.findAndCountAll({
      distinct: true,
      where: {
        banned,
        roleId: {
          [Op.in]: range,
        },
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit,
      offset,
      attributes: { exclude: ['password'] },
      include: {
        model: Role,
        attributes: ['value'],
      },
    });
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: [
        { model: BookComment, attributes: ['id'] },
        { model: Contest, attributes: ['id'] },
        { model: Book, attributes: ['id'] },
        { model: Bookmark },
        { model: Role, attributes: ['value'] },
        { model: ProducerApplication, attributes: ['id'] },
      ],
      attributes: { exclude: ['password'] },
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

  async getLibraryBooks(id: number, params: BookQueryParams) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('User with this id not found');
    return await this.bookService.getLibraryBooks(user, params);
  }

  async getBooksByUserId(id: number, params: BookQueryParams) {
    return await this.bookService.getBooksByUserId(id, params);
  }

  async getBookmarksByUserId(id: number, params: BookQueryParams) {
    return await this.bookmarkService.getByUserId(id, params);
  }

  async getBlogsByUserId(id: number, params: BookQueryParams) {
    return await this.blogService.getBlogsByUserId(id, params);
  }

  async getRatingsByUserId(id: number, params: BookQueryParams) {
    return await this.ratingService.getRatingsByUserId(id, params);
  }

  async getBlogCommentsByUserId(id: number, params: BookQueryParams) {
    return await this.blogCommentsService.getBlogCommentsByUserId(id, params);
  }

  async getContestCommentsByUserId(id: number, params: BookQueryParams) {
    return await this.contestCommentsService.getCommentsByUserId(id, params);
  }

  async getBookCommentsByUserId(id: number, params: PaginationQueryParams) {
    return await this.bookCommentsService.getCommentsByUserId(id, params);
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
      attributes: { exclude: ['password'] },
    });
    this.validateUser(user);

    if (user.role.value === RoleNames.ADMIN) {
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
        { model: BookComment, attributes: ['id'] },
        { model: Contest, attributes: ['id'] },
        { model: Book, attributes: ['id'] },
        { model: Bookmark },
        { model: Role, attributes: ['value'] },
        { model: ProducerApplication, attributes: ['id'] },
      ],
    });
    return user;
  }
}
