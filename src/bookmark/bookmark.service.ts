import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReadingProgress } from 'src/reading-progress/reading-progress.model';
import { ReadingProgressService } from 'src/reading-progress/reading-progress.service';
import { PaginationQueryParams } from 'src/types/types';
import { Bookmark } from './bookmark.model';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PatchBookmarkDto } from './dto/patch-bookmark.dto';

@Injectable()
export class BookmarkService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(
    @InjectModel(Bookmark)
    private bookmarkRepository: typeof Bookmark,
    private readingProgressService: ReadingProgressService,
  ) {}

  async createBookmark({
    userId,
    bookId,
    chapterId,
    pageId,
  }: CreateBookmarkDto) {
    const testBookmark = await this.bookmarkRepository.findOne({
      where: { userId, bookId },
      include: { model: ReadingProgress },
    });
    // this.validateBookmark(testBookmark, true);
    if (testBookmark) {
      return await this.updateBookmark(testBookmark.id, {
        chapterId,
        pageId,
      });
    } else {
      const readingProgress =
        await this.readingProgressService.createReadingProgress({
          chapterId,
          pageId,
        });
      const bookmark = await this.bookmarkRepository.create({
        userId,
        bookId,
        progressId: readingProgress.id,
      });
      return bookmark;
    }
  }

  async getById(id: number) {
    const bookmark = await this.bookmarkRepository.findByPk(id, {
      include: { model: ReadingProgress },
    });
    this.validateBookmark(bookmark);
    return bookmark;
  }

  async getByUserId(
    id: number,
    {
      limit = BookmarkService.DEFAULT_LIMIT,
      offset = BookmarkService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const bookmarks = await this.bookmarkRepository.findAndCountAll({
      where: { userId: id },
      include: { model: ReadingProgress },
      distinct: true,
      limit,
      offset,
    });
    return bookmarks;
  }

  async getByBookId(
    id: number,
    {
      limit = BookmarkService.DEFAULT_LIMIT,
      offset = BookmarkService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const bookmarks = await this.bookmarkRepository.findAndCountAll({
      where: { bookId: id },
      include: { model: ReadingProgress },
      distinct: true,
      limit,
      offset,
    });
    return bookmarks;
  }

  async getAll({
    limit = BookmarkService.DEFAULT_LIMIT,
    offset = BookmarkService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const bookmarks = await this.bookmarkRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
    });
    return bookmarks;
  }

  async deleteBookmark(id: number) {
    const bookmark = await this.bookmarkRepository.findByPk(id);
    this.validateBookmark(bookmark);
    await this.readingProgressService.deleteReadingProgress(
      bookmark.progressId,
    );
    await bookmark.destroy();
    return bookmark;
  }

  async updateBookmark(id: number, dto: PatchBookmarkDto) {
    const bookmark = await this.bookmarkRepository.findByPk(id);
    this.validateBookmark(bookmark);
    const readingProgress = await this.readingProgressService.getById(
      bookmark.progressId,
    );
    await this.readingProgressService.updateReadingProgress(
      dto,
      readingProgress.id,
    );
    return bookmark;
  }

  private validateBookmark(bookmark: Bookmark, reverse: boolean = false) {
    if (reverse ? bookmark : !bookmark) {
      throw new HttpException(
        'Such bookmark does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
