import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProducerApplicationService } from './producer-application.service';
import { Roles } from 'src/auth/roles.decorator';
import { RoleNames } from 'src/constants';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateProducerApplicationDto } from './dto/create-producer-application.dto';
import { PaginationQueryParams } from 'src/types/types';

@Controller('producer-applications')
export class ProducerApplicationController {
  constructor(private producerApplicationService: ProducerApplicationService) {}

  @Roles(RoleNames.USER)
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreateProducerApplicationDto) {
    return this.producerApplicationService.createApplication(dto);
  }

  @Roles(RoleNames.ADMIN)
  @UseGuards(RoleGuard)
  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.producerApplicationService.getAllApplications(query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.producerApplicationService.getApplicationById(id);
  }

  @Roles(RoleNames.ADMIN)
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.producerApplicationService.deleteApplication(id);
  }

  @Roles(RoleNames.ADMIN)
  @UseGuards(RoleGuard)
  @Post('/:id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.producerApplicationService.confirmApplication(id);
  }
}
