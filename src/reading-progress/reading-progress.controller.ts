import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { PatchReadingProgressDto } from './dto/patch-reading-progrss.dto';
import { ReadingProgressService } from './reading-progress.service';

@Controller('reading-progress')
export class ReadingProgressController {
  constructor(private readingProgressService: ReadingProgressService) {}

  @Post()
  create(@Body() dto: CreateReadingProgressDto) {
    return this.readingProgressService.createReadingProgress(dto);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.readingProgressService.getById(id);
  }

  @Patch('/:id')
  update(
    @Body() dto: PatchReadingProgressDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.readingProgressService.updateReadingProgress(dto, id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.readingProgressService.deleteReadingProgress(id);
  }
}
