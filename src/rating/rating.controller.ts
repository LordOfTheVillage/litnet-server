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
import { CreateRatingDto } from './dto/create-rating.dto';
import { PatchRatingDto } from './dto/patch-rating.dto';
import { RatingService } from './rating.service';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreateRatingDto) {
    return this.ratingService.createRating(dto);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.ratingService.getAllRatings(query);
  }

  @Get('/user/:userId/book/:bookId')
  getByUserIdAndBookId(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.ratingService.getRatingByIds(userId, bookId);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.getRatingById(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.deleteRating(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:id')
  update(@Body() dto: PatchRatingDto, @Param('id', ParseIntPipe) id: number) {
    return this.ratingService.updateRating(dto, id);
  }
}
