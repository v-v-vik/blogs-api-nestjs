import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/session.repository';
import { RefreshTokenPayload } from '../../../dto/tokens/tokens-payload.dto';

export class TerminateAllSessionsCommand {
  constructor(public payload: RefreshTokenPayload) {}
}

@CommandHandler(TerminateAllSessionsCommand)
export class TerminateAllSessionsUseCase
  implements ICommandHandler<TerminateAllSessionsCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: TerminateAllSessionsCommand): Promise<boolean> {
    return this.sessionsRepository.terminateAllSessions(command.payload);
  }
}
