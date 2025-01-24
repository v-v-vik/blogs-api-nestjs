import { Response } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../sessions/infrastructure/session.repository';

export class LogoutUserCommand {
  constructor(
    public deviceId: string,
    public res: Response,
  ) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const foundSession =
      await this.sessionsRepository.findByDeviceIdOrNotFoundException(
        command.deviceId,
      );
    foundSession.flagAsDeleted();
    await this.sessionsRepository.save(foundSession);

    command.res.clearCookie('refreshToken');
  }
}
