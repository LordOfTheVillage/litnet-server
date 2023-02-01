import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post()
  create(@Body() dto: CreateRatingDto) {
    return this.ratingService.createRating(dto);
  }

  @Get()
  getAll() {
    return this.ratingService.getAllRatings();
  }

  @Get('/book/:id')
  getByBookId(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.getRatingByBookId(+id);
  }

  @Get('/user/:id')
  getByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.getRatingByUserId(+id);
  }
}
