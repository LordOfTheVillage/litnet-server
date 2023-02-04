import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BlogComment } from './blog-comment.model';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { PatchBlogCommentDto } from './dto/patch-blog-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectModel(BlogComment) private blogCommentRepository: typeof BlogComment,
  ) {}

  async createBlogComment(dto: CreateBlogCommentDto) {
    const suspect = await this.blogCommentRepository.findOne({
      where: { userId: +dto.userId, blogId: +dto.blogId },
    });
    await this.checkExistingBlogComment(suspect);

    const blogComment = await this.blogCommentRepository.create(dto);
    return blogComment;
  }

  async getAllBlogComments(limit?: number, offset?: number) {
    const blogComments = await this.blogCommentRepository.findAll({
      limit: limit ? +limit : undefined,
      offset: offset ? +offset : undefined,
    });
    return blogComments;
  }

  async getBlogCommentById(id: number) {
    const blogComment = await this.blogCommentRepository.findByPk(id);
    await this.validateBlogComment(blogComment);
    return blogComment;
  }

  async getBlogCommentsByBlogId(id: number, limit?: number, offset?: number) {
    const blogComments = await this.blogCommentRepository.findAll({
      where: { blogId: id },
      limit: limit ? +limit : undefined,
      offset: offset ? +offset : undefined,
    });
    return blogComments;
  }

  async getBlogCommentsByUserId(id: number, limit?: number, offset?: number) {
    const blogComments = await this.blogCommentRepository.findAll({
      where: { userId: id },
      limit: limit ? +limit : undefined,
      offset: offset ? +offset : undefined,
    });
    return blogComments;
  }

  async updateBlogComment(id: number, dto: PatchBlogCommentDto) {
    const blogComment = await this.blogCommentRepository.findByPk(id);
    await this.validateBlogComment(blogComment);

    await blogComment.update(dto);
    return blogComment;
  }

  async deleteBlogComment(id: number) {
    const blogComment = await this.blogCommentRepository.findByPk(id);
    await this.validateBlogComment(blogComment);

    await blogComment.destroy();
    return blogComment;
  }

  private async checkExistingBlogComment(blogComment: BlogComment) {
    if (blogComment) {
      throw new HttpException(
        'Blog comment already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateBlogComment(blogComment: BlogComment) {
    if (!blogComment) {
      throw new HttpException('Blog comment not found', HttpStatus.NOT_FOUND);
    }
  }
}
