import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BlogComment } from 'src/blog-comment/blog-comment.model';
import { PaginationQueryParams } from 'src/types/types';
import { Blog } from './blog.model';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PatchBlogDto } from './dto/patch-blog.dto';

@Injectable()
export class BlogService {
  private static readonly DEFAULT_LIMIT = 7;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(@InjectModel(Blog) private blogRepository: typeof Blog) {}

  async createBlog(dto: CreateBlogDto) {
    const suspect = await this.blogRepository.findOne({
      where: { title: dto.title },
    });
    this.checkExistingBlog(suspect);
    const parsedDto = await this.parseDto(dto);
    const blog = await this.blogRepository.create(parsedDto);
    return blog;
  }

  async getAllBlogs({
    limit = BlogService.DEFAULT_LIMIT,
    offset = BlogService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const blogs = await this.blogRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
      include: { model: BlogComment, attributes: ['id'] },
    });
    return blogs;
  }

  async getBlogById(id: number) {
    const blog = await this.blogRepository.findByPk(id);
    this.validateBlog(blog);
    return blog;
  }

  async getBlogsByUserId(
    id: number,
    {
      limit = BlogService.DEFAULT_LIMIT,
      offset = BlogService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const blogs = await this.blogRepository.findAndCountAll({
      where: { userId: id },
      distinct: true,
      limit,
      offset,
      include: { model: BlogComment, attributes: ['id'] },
    });
    return blogs;
  }

  async updateBlog(id: number, dto: PatchBlogDto) {
    const blog = await this.blogRepository.findByPk(id);
    this.validateBlog(blog);

    await blog.update(dto);
    return blog;
  }

  async deleteBlog(id: number) {
    const blog = await this.blogRepository.findByPk(id);
    this.validateBlog(blog);

    await blog.destroy();
    return blog;
  }

  private async parseDto(dto: CreateBlogDto) {
    const parsedDto = {
      ...dto,
      userId: +dto.userId,
    };
    return parsedDto;
  }

  private validateBlog(blog: Blog) {
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
  }

  private checkExistingBlog(blog: Blog) {
    if (blog) {
      throw new HttpException(
        'Blog with this title already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
