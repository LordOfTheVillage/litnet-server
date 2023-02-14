import {
  Body,
  Controller,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseInterceptors(FileInterceptor('img'))
  login(@Body() dto: AuthUserDto) {
    return this.authService.login(dto);
  }

  @Post('/registration')
  @UseInterceptors(FileInterceptor('img'))
  create(@Body() dto: CreateUserDto, @UploadedFile() img: Express.Multer.File) {
    return this.authService.registration(dto, img);
  }

  @Patch('/password')
  updatePassword(
    @Body('id', ParseIntPipe) id: number,
    @Body('password') password: string,
  ) {
    return this.authService.updatePassword(id, password);
  }

  @Post('/refresh')
  refreshToken(@Body('token') token: string) {
    return this.authService.checkAuthorization(token);
  }
}
