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
import { PatchContestApplicationDto } from 'src/contest-application/dto/update-contest-application.dto';
import { ModerationGuard } from 'src/guards/moderation.guard';
import { CreateContestWinnerDto } from 'src/contest-winner/dto/create-contest-winner.dto';
import { CreateContestModerationDto } from 'src/contest-moderation/dto/create-moderation.dto';
import { RoleNames } from 'src/constants';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  @Roles(...Object.values(RoleNames).filter((r) => r !== RoleNames.USER))
  @UseGuards(RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() contestDto: CreateContestDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.contestService.createContest(contestDto, img);
  }

  @Get('/:contestId')
  getById(@Param('contestId', ParseIntPipe) id: number) {
    return this.contestService.getContestById(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Post('/:contestId/comments')
  createComment(@Body() dto: CreateContestCommentDto) {
    return this.contestService.createComment(dto);
  }

  @Get('/user/:id')
  getContestsByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.getContestByUserId(id);
  }

  @Get('/:contestId/comments')
  getCommentsByContestId(
    @Param('contestId', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestService.getCommentsByContestId(id, query);
  }

  @Get('/:contestId/comments/:id')
  getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.getCommentById(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Delete('/:contestId/comments/:id')
  deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.deleteComment(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Patch('/:contestId/comments/:id')
  updateComment(
    @Body() dto: PatchContestCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contestService.updateComment(id, dto);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Post('/:contestId/application')
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

  @Get('/:contestId/application')
  getApplicationsByContestId(
    @Param('contestId', ParseIntPipe) id: number,
    @Query() query: VerifiedParams,
  ) {
    return this.contestService.getApplicationsByContestId(id, query);
  }

  @UseGuards(ContestOwnerGuard)
  @Post('/:contestId/winner')
  createWinner(@Body() dto: CreateContestWinnerDto) {
    return this.contestService.createWinner(dto);
  }

  @UseGuards(ContestOwnerGuard)
  @Post('/:contestId/moderation')
  createModeration(@Body() dto: CreateContestModerationDto) {
    return this.contestService.createModeration(dto);
  }

  @Get('/:contestId/moderation')
  getModeratorsByContestId(
    @Param('contestId', ParseIntPipe) id: number,
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

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Patch('/:contestId')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('contestId', ParseIntPipe) id: number,
    @Body() contestDto: PatchContestDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.contestService.updateContest(contestDto, id, img);
  }

  @UseGuards(ContestOwnerGuard)
  @Delete('/:contestId')
  delete(@Param('contestId', ParseIntPipe) id: number) {
    return this.contestService.deleteContest(id);
  }
}
