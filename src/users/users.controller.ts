import {
  Controller,
  Post,
  Body,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(@Body() userDto: CreateUserDto, @UploadedFile() image) {
    return this.usersService.createUser(userDto, image);
  }

  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }
}
