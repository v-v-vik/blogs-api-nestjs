import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserInputDto } from '../../../api/dto/user.input-dto';
import { UsersService } from '../../users.service';
import { SQLUsersRepository } from '../../../infrastructure/user-sql.repository';

export class CreateUserAdminCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserAdminCommand)
export class CreateUserAdminUseCase
  implements ICommandHandler<CreateUserAdminCommand>
{
  constructor(
    private usersService: UsersService,
    private sqlUsersRepository: SQLUsersRepository,
  ) {}

  async execute({ dto }: CreateUserAdminCommand): Promise<string> {
    const newUser = await this.usersService.create(dto);
    newUser.flagAsConfirmed();
    return await this.sqlUsersRepository.create(newUser);
  }
}
