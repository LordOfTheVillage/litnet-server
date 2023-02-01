import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Post()
  create(@Body() dto: CreateGenreDto) {
    console.log(dto);
    return this.genreService.createGenre(dto);
  }

  @Get('/:id')
  getById(@Param('id') id: number | string) {
    return this.genreService.getGenreById(+id);
  }

  @Get()
  getAll() {
    return this.genreService.getAllGenres();
  }
}
