import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RtJwtAuthGuard } from '../../guards/refresh-token/rt-jwt-auth.guard';
import { ExtractPayloadFromRequest } from '../../guards/decorators/param/rt-payload-from-req.decorator';
import { RefreshTokenPayload } from '../../dto/tokens/tokens-payload.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { TerminateSessionCommand } from '../application/useCases/terminate-session-by-id.usecase';
import { TerminateAllSessionsCommand } from '../application/useCases/terminate-all-sessions.usecase';
import { SessionsQueryRepository } from '../infrastructure/session.query-repository';
import { UUIDValidationPipe } from '../../../../core/pipes/UUID-validation.pipe';

@SkipThrottle()
@Controller('security/devices')
export class SessionsController {
  constructor(
    private sessionsQueryRepository: SessionsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(RtJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async showActiveSessions(
    @ExtractPayloadFromRequest() payload: RefreshTokenPayload,
  ) {
    return this.sessionsQueryRepository.findAllActiveSessions(payload.id);
  }

  @Delete()
  @UseGuards(RtJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateAllSessions(
    @ExtractPayloadFromRequest() payload: RefreshTokenPayload,
  ) {
    return this.commandBus.execute(
      new TerminateAllSessionsCommand(payload.deviceId, payload.id),
    );
  }

  @Delete(':id')
  @UseGuards(RtJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateSessionById(
    @ExtractPayloadFromRequest() payload: RefreshTokenPayload,
    @Param('id', UUIDValidationPipe) id: string,
  ) {
    return this.commandBus.execute(new TerminateSessionCommand(id, payload.id));
  }
}
