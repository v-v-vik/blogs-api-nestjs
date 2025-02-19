import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserInputDto } from '../../../api/dto/user.input-dto';
import { UsersService } from '../../users.service';
import { UsersRepository } from '../../../infrastructure/user.repository';

export class CreateUserAdminCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserAdminCommand)
export class CreateUserAdminUseCase
  implements ICommandHandler<CreateUserAdminCommand>
{
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: CreateUserAdminCommand): Promise<string> {
    const newUser = await this.usersService.create(dto);
    newUser.flagAsConfirmed();
    return await this.usersRepository.save(newUser);
  }
}
