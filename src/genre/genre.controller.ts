import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genreService.createGenre(dto);
  }

  @Get('/:name')
  getByName(@Param('name') name: string) {
    return this.genreService.getGenreByName(name);
  }

  @Get()
  getAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.genreService.getAllGenres(limit, offset);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.deleteGenre(id);
  }
}
