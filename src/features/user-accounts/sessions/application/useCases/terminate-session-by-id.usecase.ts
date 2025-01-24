import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { SessionsRepository } from '../../infrastructure/session.repository';

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
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: TerminateSessionCommand): Promise<void> {
    const foundSession =
      await this.sessionsRepository.findByDeviceIdOrNotFoundException(
        command.id,
      );
    if (foundSession.userId !== command.userId) {
      throw ForbiddenDomainException.create(
        'You can terminate only your own session.',
        'userId',
      );
    }
    foundSession.flagAsDeleted();
    await this.sessionsRepository.save(foundSession);
  }
}
