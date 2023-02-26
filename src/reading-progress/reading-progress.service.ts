import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chapter } from 'src/chapter/chapter.model';
import { Page } from 'src/page/page.model';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { PatchReadingProgressDto } from './dto/patch-reading-progrss.dto';
import { ReadingProgress } from './reading-progress.model';

@Injectable()
export class ReadingProgressService {
  constructor(
    @InjectModel(ReadingProgress)
    private readingProgressRepository: typeof ReadingProgress,
  ) {}

  async createReadingProgress(dto: CreateReadingProgressDto) {
    const readingProgress = await this.readingProgressRepository.create(dto);
    this.validateProgress(readingProgress);
    return readingProgress;
  }

  async getById(id: number) {
    const readingProgress = await this.readingProgressRepository.findByPk(id);
    this.validateProgress(readingProgress);
    return readingProgress;
  }

  async getChapter(id: number) {
    const readingProgress = await this.readingProgressRepository.findByPk(id, {
      include: [{ model: Chapter }, { model: Page }],
    });
    this.validateProgress(readingProgress);
    return readingProgress;
  }

  async updateReadingProgress(dto: PatchReadingProgressDto, id: number) {
    const readingProgress = await this.readingProgressRepository.findByPk(id);
    this.validateProgress(readingProgress);
    await readingProgress.update(dto);
    return readingProgress;
  }

  async deleteReadingProgress(id: number) {
    const readingProgress = await this.readingProgressRepository.findByPk(id);
    this.validateProgress(readingProgress);
    await readingProgress.destroy();
    return readingProgress;
  }

  private validateProgress(readingProgress: ReadingProgress) {
    if (!readingProgress) {
      throw new HttpException(
        'Such reading progress does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
