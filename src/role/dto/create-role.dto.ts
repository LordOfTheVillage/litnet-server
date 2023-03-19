import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Must be a string' })
  readonly value: string;
}
