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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async registration(dto: CreateUserDto) {
    const candidateByEmail = await this.usersService.getUserByEmail(dto.email);
    const candidateByName = await this.usersService.getUserByName(dto.name);
    this.checkUser(candidateByEmail, 'email');
    this.checkUser(candidateByName, 'name');

    const hash = await bcrypt.hash(dto.password, 5);
    const user = await this.usersService.createUser({ ...dto, password: hash });
    return this.generateToken(user);
  }

  private async checkUser(user: CreateUserDto, type: string) {
    if (user) {
      throw new HttpException(
        `User with this ${type} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(user) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(dto.email);
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Invalid email or password' });
  }
}
