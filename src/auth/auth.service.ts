import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { AuthUserDto } from './dto/auth-user.dto';
import { FileService } from 'src/file/file.service';
import { User } from 'src/users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthUserDto) {
    console.log(dto);
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async registration(dto: CreateUserDto, img?: any) {
    const candidateByEmail = await this.usersService.getUserByEmail(dto.email);
    this.checkUser(candidateByEmail, 'email');

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
    try {
      const suspect = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.getUserById(suspect.id);
      if (user) {
        return this.generateToken(user);
      }
      throw new UnauthorizedException({ message: 'Invalid refresh token' });
    } catch (e) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }
  }

  async updatePassword(id: number, password: string) {
    const hash: string = await bcrypt.hash(password, 5);
    const user = await this.usersService.updatePassword({ password: hash }, id);
    return this.generateToken(user);
  }

  private checkUser(user: CreateUserDto, type: string) {
    if (user) {
      throw new BadRequestException(`User with this ${type} already exists`);
    }
  }

  private async generateToken(user: User) {
    const { password, ...payload } = { ...user.dataValues };
    if (!payload.books) payload.books = [];
    if (!payload.role) payload.role = await user.$get('role');

    return {
      token: this.jwtService.sign(payload as User),
      user: payload as User,
    };
  }

  private async validateUser(dto: AuthUserDto) {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (user === null)
      throw new NotFoundException('There is no user with this emil');
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException('Invalid email or password');
  }
}
