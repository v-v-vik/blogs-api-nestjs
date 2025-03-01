import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/session.repository';
import { UpdateResult } from 'typeorm';

export class TerminateAllSessionsCommand {
  constructor(
    public deviceId: string,
    public userId: string,
  ) {}
}

@CommandHandler(TerminateAllSessionsCommand)
export class TerminateAllSessionsUseCase
  implements ICommandHandler<TerminateAllSessionsCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: TerminateAllSessionsCommand): Promise<UpdateResult> {
    return this.sessionsRepository.terminateAllSessions(
      command.deviceId,
      command.userId,
    );
  }
}
