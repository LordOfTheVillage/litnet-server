import {
  Controller,
  Post,
  Body,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import {
  BookQueryParams,
  PaginationQueryParams,
  VerifiedParams,
} from 'src/types/types';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './users.service';
import { RoleNames } from 'src/constants';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() userDto: CreateUserDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.usersService.createUser(userDto, img);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Get()
  getAll(@Query() query: VerifiedParams) {
    return this.usersService.getAllUsers(query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Get('/:id/avatar')
  getAvatar(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getAvatar(id);
  }

  @Get('/:id/library')
  getLibraryBooks(
    @Param('id', ParseIntPipe) userId: number,
    @Query() query: BookQueryParams,
  ) {
    return this.usersService.getLibraryBooks(userId, query);
  }

  @Get('/:id/books')
  getAllByUser(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: BookQueryParams,
  ) {
    return this.usersService.getBooksByUserId(id, query);
  }

  @Get('/:id/bookmark')
  getBookmarksByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.usersService.getBookmarksByUserId(id, query);
  }

  @Get('/:id/blog')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.usersService.getBlogsByUserId(id, query);
  }

  @Get('/:id/ratings')
  getRatingsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.usersService.getRatingsByUserId(id, query);
  }

  @Get('/:id/contest-comments')
  getContestCommentsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.usersService.getContestCommentsByUserId(id, query);
  }

  @Get('/:id/blog-comments')
  getBlogCommentsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.usersService.getBlogCommentsByUserId(id, query);
  }

  @Get('/:id/book-comments')
  getBookCommentsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.usersService.getBookCommentsByUserId(id, query);
  }

  @Patch('/:id/avatar')
  @UseInterceptors(FileInterceptor('img'))
  updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(id, img);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: PatchUserDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.usersService.updateUser(userDto, id, img);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Roles(RoleNames.ADMIN)
  @UseGuards(RoleGuard)
  @Post('/ban')
  banUser(@Body() banDto: BanUserDto) {
    return this.usersService.banUser(banDto);
  }

  @Roles(RoleNames.ADMIN)
  @UseGuards(RoleGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }
}
