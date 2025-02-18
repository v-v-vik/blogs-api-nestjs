import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.main-dto';
import { BcryptService } from './bcrypt.service';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';
import { SQLUsersRepository } from '../infrastructure/user-sql.repository';
import { User } from '../domain/user-sql.entity';

@Injectable()
export class UsersService {
  constructor(
    private bcryptService: BcryptService,
    private sqlUsersRepository: SQLUsersRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { login, password, email } = dto;
    const user = await this.sqlUsersRepository.findByLoginAndEmail(
      login,
      email,
    );
    console.log('checking login and email if exist', user);
    const errors: any = [];
    if (user?.login === dto.login) {
      errors.push({ field: 'login', message: 'Login already exists' });
    }
    if (user?.email === dto.email) {
      errors.push({ field: 'email', message: 'Email already exists' });
    }
    if (errors.length > 0) {
      throw BadRequestDomainException.createWithArray(errors);
    }
    const passwordHash = await this.bcryptService.passwordHash(password);
    return User.createNewInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });
  }

  async delete(id: string) {
    const user = await this.sqlUsersRepository.findByIdOrNotFoundException(id);
    user.flagAsDeleted();
    await this.sqlUsersRepository.update(user);
  }
}
