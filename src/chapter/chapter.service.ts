import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chapter } from './chapter.model';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { PatchChapterDto } from './dto/patch-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter) private chapterRepository: typeof Chapter,
  ) {}

  async createChapter(dto: CreateChapterDto) {
    const chapters = await this.getChaptersByBookId(dto.bookId);
    const number = chapters.length + 1;
    const chapter = await this.chapterRepository.create({ ...dto, number });
    return chapter;
  }

  async getChaptersByBookId(bookId: number) {
    const chapters = await this.chapterRepository.findAll({
      where: { bookId },
    });
    return chapters;
  }

  async getAllChapters() {
    const chapters = await this.chapterRepository.findAll();
    return chapters;
  }

  async deleteChapter(id: number) {
    const chapter = await this.chapterRepository.findOne({ where: { id } });
    if (!chapter) {
      throw new HttpException('Such chapter does not exist', HttpStatus.BAD_REQUEST);
    }
    await chapter.destroy();
    return chapter;
  }

  async updateChapter(id: number, dto: PatchChapterDto) {
    const chapter = await this.chapterRepository.findOne({ where: { id } });
    if (!chapter) {
      throw new HttpException('Such chapter does not exist', HttpStatus.BAD_REQUEST);
    }
    await chapter.update(dto);
    return chapter;
  }
}
