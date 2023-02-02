import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './rating.model';

@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating) private ratingRepository: typeof Rating) {}

  async createRating(dto: CreateRatingDto) {
    const ratingById = await this.getRatingByIds(dto.userId, dto.bookId);
    if (ratingById) {
      throw new HttpException('Such rating exists', HttpStatus.BAD_REQUEST);
    }
    const rating = await this.ratingRepository.create(dto);
    return rating;
  }

  async getAllRatings() {
    const ratings = await this.ratingRepository.findAll();
    return ratings;
  }

  async getRatingsByBookId(id: number) {
    const rating = await this.ratingRepository.findAll({
      where: { bookId: id },
    });
    return rating;
  }

  async getRatingsByUserId(id: number) {
    const rating = await this.ratingRepository.findAll({
      where: { userId: id },
    });
    return rating;
  }

  async getRatingByIds(userId: number, bookId: number) {
    const rating = await this.ratingRepository.findOne({
      where: { userId, bookId },
    });
    return rating;
  }
}
