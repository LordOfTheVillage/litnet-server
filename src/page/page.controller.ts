import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { PatchPageDto } from './dto/patch-page.dto';
import { PageService } from './page.service';

@Controller('pages')
export class PageController {
  constructor(private pageService: PageService) {}

  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pageService.createPage(dto);
  }

  @Get('/book/:id')
  getByBookId(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.getPagesByChapterId(id);
  }

  @Get()
  getAll() {
    return this.pageService.getAllPages();
  }

  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.getPageById(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.deletePage(id);
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchPageDto) {
    return this.pageService.updatePage(id, dto);
  }

}
