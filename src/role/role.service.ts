import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.model';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getAllRoles() {
    const roles = await this.roleRepository.findAll();
    return roles;
  }

  async getRoleByValue(value: string) {
    let role = await this.roleRepository.findOne({
      where: { value },
      include: { model: User, attributes: ['id', 'name', 'email'] },
    });
    if (role === null) {
      role = await this.createRole({ value });
    }
    return role;
  }
}
