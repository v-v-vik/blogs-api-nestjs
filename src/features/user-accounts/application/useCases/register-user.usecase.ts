import { CreateUserInputDto } from '../../api/dto/user.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';
import { EmailService } from '../../../notifications/email.service';
import { UsersRepository } from '../../infrastructure/user.repository';

export class RegisterUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    const newUser = await this.usersService.create(dto);
    await this.usersRepository.save(newUser);
    this.emailService
      .sendRegistrationConfirmationEmail(
        newUser.email,
        newUser.confirmationCode,
      )
      .catch((error) => console.log('error when trying to send email', error));
  }
}
