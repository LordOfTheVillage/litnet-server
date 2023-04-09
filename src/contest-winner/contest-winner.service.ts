import { ConflictException, Injectable } from '@nestjs/common';
import { ContestWinner } from './contest-winner.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateContestWinnerDto } from './dto/create-contest-winner.dto';

@Injectable()
export class ContestWinnerService {
  constructor(
    @InjectModel(ContestWinner)
    private contestWinnerRepository: typeof ContestWinner,
  ) {}

  async createWinner(dto: CreateContestWinnerDto) {
    const suspect = await this.contestWinnerRepository.findOne({
      where: { contestId: dto.contestId, bookId: dto.bookId },
    });
    this.checkExisting(suspect);

    return await this.contestWinnerRepository.create(dto);
  }

  async getByBookId(id: number) {
    return await this.contestWinnerRepository.findAndCountAll({
      where: { bookId: id },
    });
  }

  checkExisting(suspect: ContestWinner) {
    if (suspect) throw new ConflictException('Such winner already exists');
  }
}
