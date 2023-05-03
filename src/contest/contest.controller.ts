import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryParams, VerifiedParams } from 'src/types/types';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { PatchContestDto } from './dto/patch-contest.dto';
import { ContestOwnerGuard } from '../guards/contest-owner.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateContestCommentDto } from 'src/contest-comment/dto/create-contest-comment.dto';
import { PatchContestCommentDto } from 'src/contest-comment/dto/patch-contest-comment.dto';
import { CreateContestApplicationDto } from 'src/contest-application/dto/create-contest-application.dto';
import { PatchContestApplicationDto } from 'src/contest-application/dto/patch-contest-application.dto';
import { ModerationGuard } from 'src/guards/moderation.guard';
import { CreateContestWinnerDto } from 'src/contest-winner/dto/create-contest-winner.dto';
import { CreateContestModerationDto } from 'src/contest-moderation/dto/create-moderation.dto';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() contestDto: CreateContestDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.contestService.createContest(contestDto, img);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.getContestById(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post('/contest/:id/comments')
  createComment(@Body() dto: CreateContestCommentDto) {
    return this.contestService.createComment(dto);
  }

  @Get('/user/:id')
  getContestsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestService.getContestsByUserId(id, query);
  }

  @Get('/contest/:contestId/comments')
  getCommentsByContestId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestService.getCommentsByContestId(id, query);
  }

  @Get('/contest/:contestId/comments/:id')
  getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.getCommentById(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Delete('/contest/:contestId/comments/:id')
  deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.deleteComment(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/contest/:contestId/comments/:id')
  updateComment(
    @Body() dto: PatchContestCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contestService.updateComment(id, dto);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post('/:id/application')
  createApplication(@Body() dto: CreateContestApplicationDto) {
    return this.contestService.createApplication(dto);
  }

  @UseGuards(ModerationGuard)
  @Patch('/:contestId/application/:id')
  updateApplication(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchContestApplicationDto,
  ) {
    return this.contestService.updateApplication(id, dto);
  }

  @UseGuards(ModerationGuard)
  @Delete('/:contestId/application/:id')
  deleteApplication(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.deleteApplication(id);
  }

  @Get('/:contestId/application/:id')
  getApplicationById(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.getApplicationById(id);
  }

  @Get('/:id/application')
  getApplicationsByContestId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: VerifiedParams,
  ) {
    return this.contestService.getApplicationsByContestId(id, query);
  }

  @UseGuards(ContestOwnerGuard)
  @Post('/:id/winner')
  createWinner(@Body() dto: CreateContestWinnerDto) {
    return this.contestService.createWinner(dto);
  }

  @UseGuards(ContestOwnerGuard)
  @Post('/:id/moderation')
  createModeration(@Body() dto: CreateContestModerationDto) {
    return this.contestService.createModeration(dto);
  }

  @Get('/:id/moderation')
  getModeratorsByContestId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    console.log(id);
    return this.contestService.getModeratorsByContestId(id, query);
  }

  @UseGuards(ContestOwnerGuard)
  @Delete('/:contestId/moderation/:id')
  deleteModeration(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.deleteModeration(id);
  }

  @Get()
  getAll(@Query() query: VerifiedParams) {
    return this.contestService.getAllContests(query);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() contestDto: PatchContestDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.contestService.updateContest(contestDto, id, img);
  }

  @UseGuards(ContestOwnerGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.deleteContest(id);
  }
}
