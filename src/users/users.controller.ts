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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Get()
  getAll() {
    return this.usersService.getAllUsers();
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
  update(@Param('id', ParseIntPipe) id: number, @Body() userDto: PatchUserDto) {
    return this.usersService.updateUser(userDto, id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

}
