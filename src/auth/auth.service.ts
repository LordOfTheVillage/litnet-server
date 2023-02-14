import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import {
  HttpException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { AuthUserDto } from './dto/auth-user.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthUserDto) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async registration(dto: CreateUserDto, img?: any) {
    const candidateByEmail = await this.usersService.getUserByEmail(dto.email);
    const candidateByName = await this.usersService.getUserByName(dto.name);
    this.checkUser(candidateByEmail, 'email');
    this.checkUser(candidateByName, 'name');

    const hash = await bcrypt.hash(dto.password, 5);
    const user = await this.usersService.createUser(
      {
        ...dto,
        password: hash,
      },
      img,
    );
    return this.generateToken(user);
  }

  async checkAuthorization(token: string) {
    if (!token) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }
    const suspect = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(suspect.id);
    if (user) {
      return { token: this.generateToken(user), user };
    }
    throw new UnauthorizedException({ message: 'Invalid refresh token' });
  }

  async updatePassword(id: number, password: string) {
    const hash: string = await bcrypt.hash(password, 5);
    const user = await this.usersService.updatePassword({ password: hash }, id);
    return { token: this.generateToken(user), user };
  }

  private checkUser(user: CreateUserDto, type: string) {
    if (user) {
      throw new HttpException(
        `User with this ${type} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken({
    id,
    email,
    autobiography,
    readingView,
    name,
    img,
  }) {
    const payload = { id, email, autobiography, readingView, name, img };
    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  private async validateUser(dto: AuthUserDto) {
    const user = await this.usersService.getUserByEmail(dto.email);
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    // const passwordEquals = dto.password === user.password;
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Invalid email or password' });
  }
}
