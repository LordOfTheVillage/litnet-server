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
import { PaginationQueryParams } from 'src/types/types';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { RoleNames } from 'src/constants';

@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Roles(RoleNames.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genreService.createGenre(dto);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.getGenreById(id);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.genreService.getAllGenres(query);
  }

  @Roles(RoleNames.ADMIN)
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.deleteGenre(id);
  }
}
