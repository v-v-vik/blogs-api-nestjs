import { Response } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SQLSessionsRepository } from '../../sessions/infrastructure/session-sql.repository';

export class LogoutUserCommand {
  constructor(
    public deviceId: string,
    public res: Response,
  ) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  constructor(private sqlSessionsRepository: SQLSessionsRepository) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const foundSession =
      await this.sqlSessionsRepository.findByDeviceIdOrNotFoundException(
        command.deviceId,
      );
    foundSession.flagAsDeleted();
    await this.sqlSessionsRepository.update(foundSession);

    command.res.clearCookie('refreshToken');
  }
}
