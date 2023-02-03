import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PageService } from 'src/page/page.service';
import { Chapter } from './chapter.model';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { PatchChapterDto } from './dto/patch-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter) private chapterRepository: typeof Chapter,
    private pageService: PageService,
  ) {}

  async createChapter(dto: CreateChapterDto) {
    // TODO book validation
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
    const chapters = await this.chapterRepository.findAll({
      include: { all: true },
    });
    return chapters;
  }

  async getChapterById(id: number) {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return chapter;
  }

  async deleteChapter(id: number) {
    const chapter = await this.chapterRepository.findOne({ where: { id } });
    this.validateChapter(chapter);
    await this.updateChaptersNumbers(chapter.bookId, chapter.number);
    await this.deletePagesByChapterId(id);

    await chapter.destroy();
    return chapter;
  }

  async updateChapter(id: number, dto: PatchChapterDto) {
    const chapter = await this.chapterRepository.findOne({ where: { id } });
    this.validateChapter(chapter);
    await chapter.update(dto);
    return chapter;
  }

  private validateChapter(chapter: Chapter) {
    if (!chapter) {
      throw new HttpException(
        { message: 'Such chapter does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async deletePagesByChapterId(id: number) {
    const pages = await this.pageService.getPagesByChapterId(id);
    pages.forEach(async (page) => {
      await this.pageService.deletePage(page.id);
    });
  }

  private async updateChaptersNumbers(bookId: number, number: number) {
    const chapters = await this.getChaptersByBookId(bookId);
    const chaptersToUpdate = chapters.filter(
      (chapter) => chapter.number > number,
    );
    chaptersToUpdate.forEach(async (chapter) => {
      await chapter.update({ number: chapter.number - 1 });
    });
  }
}
