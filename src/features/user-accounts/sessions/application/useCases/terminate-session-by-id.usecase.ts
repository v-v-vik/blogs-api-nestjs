import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { SQLSessionsRepository } from '../../infrastructure/session-sql.repository';

export class TerminateSessionCommand {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(TerminateSessionCommand)
export class TerminateSessionUseCase
  implements ICommandHandler<TerminateSessionCommand>
{
  constructor(private sqlSessionsRepository: SQLSessionsRepository) {}

  async execute(command: TerminateSessionCommand): Promise<void> {
    const foundSession =
      await this.sqlSessionsRepository.findByDeviceIdOrNotFoundException(
        command.id,
      );
    if (foundSession.userId.toString() !== command.userId) {
      throw ForbiddenDomainException.create(
        'You can terminate only your own session.',
        'userId',
      );
    }
    foundSession.flagAsDeleted();
    await this.sqlSessionsRepository.update(foundSession);
  }
}
