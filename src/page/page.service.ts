import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationQueryParams } from 'src/types/types';
import { CreatePageDto } from './dto/create-page.dto';
import { PatchPageDto } from './dto/patch-page.dto';
import { Page } from './page.model';

@Injectable()
export class PageService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(@InjectModel(Page) private pageRepository: typeof Page) {}

  async createPage(dto: CreatePageDto) {
    // TODO chapter validation
    const { rows } = await this.getPagesByChapterId(dto.chapterId, {});
    const number = rows.length + 1;
    const page = await this.pageRepository.create({ ...dto, number });
    return page;
  }

  async getPagesByChapterId(
    chapterId: number,
    {
      limit = PageService.DEFAULT_LIMIT,
      offset = PageService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const pages = await this.pageRepository.findAndCountAll({
      where: { chapterId },
      distinct: true,
      limit,
      offset,
    });
    return pages;
  }

  async getAllPages({
    limit = PageService.DEFAULT_LIMIT,
    offset = PageService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const pages = await this.pageRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
    });
    return pages;
  }

  async getPageById(id: number) {
    const page = await this.pageRepository.findOne({ where: { id } });
    return page;
  }

  async deletePage(id: number) {
    const page = await this.pageRepository.findOne({ where: { id } });
    this.validatePage(page);
    await this.updatePagesNumbers(page.chapterId, page.number);

    await page.destroy();
    return page;
  }

  async updatePage(id: number, dto: PatchPageDto) {
    const page = await this.pageRepository.findOne({ where: { id } });
    this.validatePage(page);
    await page.update(dto);
    return page;
  }

  private validatePage(page: Page) {
    if (!page) {
      throw new HttpException(
        { message: 'Such page does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async updatePagesNumbers(chapterId: number, number: number) {
    const { rows } = await this.getPagesByChapterId(chapterId, {});
    const pagesToUpdate = rows.filter((p) => p.number > number);
    pagesToUpdate.forEach(async (p) => {
      await p.update({ number: p.number - 1 });
    });
  }
}
