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
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { PatchRatingDto } from './dto/patch-rating.dto';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post()
  create(@Body() dto: CreateRatingDto) {
    return this.ratingService.createRating(dto);
  }

  @Get()
  getAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.ratingService.getAllRatings(limit, offset);
  }

  @Get('/book/:id')
  getByBookId(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.ratingService.getRatingsByBookId(id, limit, offset);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.ratingService.getRatingsByUserId(id, limit, offset);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.getRatingById(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.deleteRating(id);
  }

  @Patch('/:id')
  update(@Body() dto: PatchRatingDto, @Param('id', ParseIntPipe) id: number) {
    return this.ratingService.updateRating(dto, id);
  }
}
