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
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { PaginationQueryParams } from 'src/types/types';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './users.service';

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

  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Get()
  getAll(@Query() query: PaginationQueryParams) {
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

  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('/ban')
  banUser(@Body() banDto: BanUserDto) {
    return this.usersService.banUser(banDto);
  }

  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }
}
