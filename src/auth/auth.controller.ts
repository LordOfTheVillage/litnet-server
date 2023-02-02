import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: AuthUserDto) {
    return this.authService.login(dto);
  }

  // @Post('/registration')
  // registration(@Body() dto: CreateUserDto) {
  //   return this.authService.registration(dto);
  // }
  @Post('/registration')
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() dto: CreateUserDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.authService.registration(dto, img);
  }
}
