import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationQueryParams } from 'src/types/types';
import { CreateRatingDto } from './dto/create-rating.dto';
import { PatchRatingDto } from './dto/patch-rating.dto';
import { Rating } from './rating.model';

@Injectable()
export class RatingService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(@InjectModel(Rating) private ratingRepository: typeof Rating) {}

  async createRating(dto: CreateRatingDto) {
    const ratingById = await this.ratingRepository.findOne({
      where: { userId: dto.userId, bookId: dto.bookId },
    });
    if (ratingById) {
      await this.updateRating({ ...dto }, ratingById.id);
    } else {
      const rating = await this.ratingRepository.create(dto);
      return rating;
    }
  }

  async getAllRatings({
    limit = RatingService.DEFAULT_LIMIT,
    offset = RatingService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const ratings = await this.ratingRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
    });
    return ratings;
  }

  async getRatingsByBookId(
    id: number,
    {
      limit = RatingService.DEFAULT_LIMIT,
      offset = RatingService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const rating = await this.ratingRepository.findAndCountAll({
      distinct: true,
      where: { bookId: id },
      limit,
      offset,
    });
    return rating;
  }

  async getRatingsByUserId(
    id: number,
    {
      limit = RatingService.DEFAULT_LIMIT,
      offset = RatingService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const rating = await this.ratingRepository.findAndCountAll({
      where: { userId: id },
      distinct: true,
      limit,
      offset,
    });
    return rating;
  }

  async getRatingByIds(userId: number, bookId: number) {
    const rating = await this.ratingRepository.findOne({
      where: { userId, bookId },
    });
    if (!rating) throw new NotFoundException('Such rating does not exists');
    return rating;
  }

  async getRatingById(id: number) {
    const rating = await this.ratingRepository.findByPk(id);
    this.validateRating(rating);
    return rating;
  }

  async deleteRating(id: number) {
    const rating = await this.ratingRepository.findByPk(id);
    this.validateRating(rating);
    await rating.destroy();
    return rating;
  }

  async updateRating(dto: PatchRatingDto, id: number) {
    const rating = await this.ratingRepository.findByPk(id);
    this.validateRating(rating);
    await rating.update(dto);
    return rating;
  }

  private validateRating(rating: Rating) {
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
  }
}
