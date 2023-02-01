import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Must be between 4 and 16 characters' })
  readonly password: string;

  // readonly img: string;
}
