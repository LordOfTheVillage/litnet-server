import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Page } from 'src/page/page.model';
import { PageService } from 'src/page/page.service';
import { PaginationQueryParams } from 'src/types/types';
import { Chapter } from './chapter.model';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { PatchChapterDto } from './dto/patch-chapter.dto';
import { query } from 'express';

@Injectable()
export class ChapterService {
  private static readonly PAGE_SIZE = 1000;
  private static readonly DEFAULT_LIMIT = undefined;
  private static readonly DEFAULT_OFFSET = undefined;
  constructor(
    @InjectModel(Chapter) private chapterRepository: typeof Chapter,
    private pageService: PageService,
  ) {}

  async createChapter({ text, ...dto }: CreateChapterDto) {
    // TODO book validation
    // await checkPlagiarism(text);
    const { rows } = await this.getChaptersByBookId(dto.bookId, {});
    const number = rows.length + 1;
    const chapter = await this.chapterRepository.create({ ...dto, number });
    const pages = await this.generatePages(text, chapter.id);
    await this.createPages(pages, chapter.id);
    return chapter;
  }

  async getChaptersByBookId(
    bookId: number,
    {
      limit = ChapterService.DEFAULT_LIMIT,
      offset = ChapterService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const chapters = await this.chapterRepository.findAndCountAll({
      where: { bookId },
      distinct: true,
      limit,
      offset,
      include: { model: Page },
    });
    return chapters;
  }

  async getPagesByChapterId(id: number, query: PaginationQueryParams) {
    return await this.pageService.getPagesByChapterId(id, query);
  }

  async getAllChapters({
    limit = ChapterService.DEFAULT_LIMIT,
    offset = ChapterService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const chapters = await this.chapterRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
    });
    return chapters;
  }

  async getChapterById(id: number) {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      include: { model: Page, attributes: ['id', 'number', 'text'] },
    });
    return chapter;
  }

  async deleteChapter(id: number) {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      include: { all: true },
    });
    try {
      this.validateChapter(chapter);
      console.log('chapter.id', chapter.id);
      console.log('chapter.pages', chapter.pages);
      await this.deletePagesByChapterId(chapter.pages);
      await this.updateChaptersNumbers(chapter.bookId, chapter.number);
    } catch (error) {
      throw error;
    }

    await chapter.destroy();
    return chapter;
  }

  async updateChapter(id: number, { text, ...dto }: PatchChapterDto) {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      include: { all: true },
    });
    this.validateChapter(chapter);
    await chapter.update(dto);
    await this.deletePagesByChapterId(chapter.pages);
    const pages = await this.generatePages(text, chapter.id);
    await this.createPages(pages, chapter.id);
    return chapter;
  }

  async getSymbols(id: number) {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return chapter.pages.reduce((acc, page) => (acc += page.text.length), 0);
  }

  private validateChapter(chapter: Chapter) {
    if (!chapter) {
      throw new HttpException(
        { message: 'Such chapter does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async generatePages(sourceText: string, chapterId: number) {
    let pages: string[] = [];
    let text = sourceText;
    while (text.length > 0) {
      pages.push(text.slice(0, ChapterService.PAGE_SIZE));
      text = text.slice(ChapterService.PAGE_SIZE);
    }
    return pages;
  }

  private async createPages(pages: string[], chapterId: number) {
    pages.forEach(async (page, i) => {
      await this.pageService.createPage({
        text: page,
        chapterId,
        number: i + 1,
      });
    });
  }

  private async deletePagesByChapterId(pages) {
    try {
      await pages.forEach(async (page) => {
        console.log('page.id', page.id);
        await this.pageService.deletePage(page.id);
      });
    } catch (error) {
      throw error;
    }
  }

  private async updateChaptersNumbers(bookId: number, number: number) {
    const { rows } = await this.getChaptersByBookId(bookId, {});
    const chaptersToUpdate = rows.filter((chapter) => chapter.number > number);
    chaptersToUpdate.forEach(async (chapter) => {
      await chapter.update({ number: chapter.number - 1 });
    });
  }

  private async checkPlagiarism(text: string) {
    const chapters = await this.chapterRepository.findAll();
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;

    if (m === 0 || n === 0) {
      return 0;
    }

    const d: number[][] = [];

    for (let i = 0; i <= m; i++) {
      d[i] = [i];
    }

    for (let j = 0; j <= n; j++) {
      d[0][j] = j;
    }

    for (let j = 1; j <= n; j++) {
      for (let i = 1; i <= m; i++) {
        if (text1[i - 1] === text2[j - 1]) {
          d[i][j] = d[i - 1][j - 1];
        } else {
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            d[i][j - 1] + 1,
            d[i - 1][j - 1] + 1,
          );
        }
      }
    }

    const distance = d[m][n];
    const maxLength = Math.max(m, n);
    return 1 - distance / maxLength;
  }
}
