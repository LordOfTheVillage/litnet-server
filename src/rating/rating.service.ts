import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRatingDto } from './dto/create-rating.dto';
import { PatchRatingDto } from './dto/patch-rating.dto';
import { Rating } from './rating.model';

@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating) private ratingRepository: typeof Rating) {}

  async createRating(dto: CreateRatingDto) {
    // TODO user and book validation
    const ratingById = await this.getRatingByIds(dto.userId, dto.bookId);
    if (ratingById) {
      throw new HttpException('Such rating exists', HttpStatus.BAD_REQUEST);
    }
    const rating = await this.ratingRepository.create(dto);
    return rating;
  }

  async getAllRatings(limit?: number, offset?: number) {
    const ratings = await this.ratingRepository.findAndCountAll({
      limit: limit || undefined,
      offset: offset || undefined,
    });
    return ratings;
  }

  async getRatingsByBookId(id: number, limit?: number, offset?: number) {
    const rating = await this.ratingRepository.findAndCountAll({
      where: { bookId: id },
      limit: limit || undefined,
      offset: offset || undefined,
    });
    return rating;
  }

  async getRatingsByUserId(id: number, limit?: number, offset?: number) {
    const rating = await this.ratingRepository.findAndCountAll({
      where: { userId: id },
      limit: limit || undefined,
      offset: offset || undefined,
    });
    return rating;
  }

  async getRatingByIds(userId: number, bookId: number) {
    const rating = await this.ratingRepository.findOne({
      where: { userId, bookId },
    });
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
      throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
    }
  }
}
