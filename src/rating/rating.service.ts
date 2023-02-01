import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './rating.model';

@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating) private ratingRepository: typeof Rating) {}

  async createRating(dto: CreateRatingDto) {
    const rating = await this.ratingRepository.create(dto);
    return rating;
  }

  async getAllRatings() {
    const ratings = await this.ratingRepository.findAll();
    return ratings;
  }

  async getRatingByBookId(id: number) {
    const rating = await this.ratingRepository.findOne({
      where: { bookId: id },
    });
    return rating;
  }

  async getRatingByUserId(id: number) {
    const rating = await this.ratingRepository.findOne({
      where: { userId: id },
    });
    return rating;
  }
}
