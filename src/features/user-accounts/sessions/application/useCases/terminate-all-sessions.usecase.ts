import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RefreshTokenPayload } from '../../../dto/tokens/tokens-payload.dto';
import { SQLSessionsRepository } from '../../infrastructure/session-sql.repository';

export class TerminateAllSessionsCommand {
  constructor(public payload: RefreshTokenPayload) {}
}

@CommandHandler(TerminateAllSessionsCommand)
export class TerminateAllSessionsUseCase
  implements ICommandHandler<TerminateAllSessionsCommand>
{
  constructor(private sqlSessionsRepository: SQLSessionsRepository) {}

  async execute(command: TerminateAllSessionsCommand): Promise<void> {
    console.log('In the bus');
    return this.sqlSessionsRepository.terminateAllSessions(command.payload);
  }
}
