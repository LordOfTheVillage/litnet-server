import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProducerApplication } from './producer-application.model';
import { CreateProducerApplicationDto } from './dto/create-producer-application.dto';
import { PaginationQueryParams } from 'src/types/types';
import { UsersService } from 'src/users/users.service';
import { RoleNames } from 'src/constants';
import { User } from 'src/users/user.model';

@Injectable()
export class ProducerApplicationService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(
    @InjectModel(ProducerApplication)
    private producerApplicationRepository: typeof ProducerApplication,
    private userService: UsersService,
  ) {}

  async createApplication(dto: CreateProducerApplicationDto) {
    const applicationById = await this.producerApplicationRepository.findOne({
      where: { userId: dto.userId },
    });
    if (applicationById)
      throw new BadRequestException('Application already exists');

    return await this.producerApplicationRepository.create(dto);
  }

  async getAllApplications({
    limit = ProducerApplicationService.DEFAULT_LIMIT,
    offset = ProducerApplicationService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const applications =
      await this.producerApplicationRepository.findAndCountAll({
        distinct: true,
        limit,
        offset,
        include: { model: User, attributes: ['id', 'name'] },
      });
    return applications;
  }

  async getApplicationById(id: number) {
    const application = await this.producerApplicationRepository.findByPk(id);
    this.checkingExisting(application);
    return application;
  }

  async deleteApplication(id: number) {
    const application = await this.producerApplicationRepository.findByPk(id);
    this.checkingExisting(application);
    application.destroy();
    return application;
  }

  async confirmApplication(id: number) {
    const application = await this.producerApplicationRepository.findByPk(id);
    this.checkingExisting(application);

    this.userService.addRole({
      value: RoleNames.PRODUCER,
      userId: application.userId,
    });

    application.destroy();
    return application;
  }

  checkingExisting(application: ProducerApplication) {
    if (!application)
      throw new NotFoundException('Application does not exists');
  }
}
