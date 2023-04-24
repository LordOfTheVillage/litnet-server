import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { ContestModerationService } from '../contest-moderation/contest-moderation.service';
import { ContestService } from 'src/contest/contest.service';

@Injectable()
export class ModerationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private contestModerationService: ContestModerationService,
    private contestService: ContestService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized' });
      }

      const user = this.jwtService.verify(token);
      if (user.banned) {
        throw new NotAcceptableException('User was banned');
      }

      const contestId = req.params.id;
      if (!contestId)
        throw new ForbiddenException('You does not have enough rights');

      try {
        await this.contestModerationService.getByUserAndContestId(
          user.id,
          Number(contestId),
        );
      } catch (error) {
        const contest = await this.contestService.getContestById(contestId);
        if (contest && contest.userId !== user.id) {
          throw new ForbiddenException('You does not have enough rights');
        }
      }

      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: e.message });
    }
  }
}
