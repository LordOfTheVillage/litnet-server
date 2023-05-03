import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationQueryParams } from 'src/types/types';
import { CreatePageDto } from './dto/create-page.dto';
import { PatchPageDto } from './dto/patch-page.dto';
import { PageService } from './page.service';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleNames } from 'src/constants';

@Controller('pages')
export class PageController {
  constructor(private pageService: PageService) {}

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pageService.createPage(dto);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.pageService.getAllPages(query);
  }

  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.getPageById(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.deletePage(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchPageDto) {
    return this.pageService.updatePage(id, dto);
  }
}
