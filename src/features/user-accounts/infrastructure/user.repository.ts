import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { DeletionStatus } from '../../../core/dto/deletion-status.enum';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findByIdOrNotFoundException(userId: string): Promise<User> {
    const res = await this.usersRepo.findOne({
      where: {
        id: Number(userId),
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });

    if (!res) {
      throw NotFoundDomainException.create('User not found.');
    }
    return res;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const res = await this.usersRepo.findOne({
      where: [
        { email: loginOrEmail, deletionStatus: DeletionStatus.NotDeleted },
        { login: loginOrEmail, deletionStatus: DeletionStatus.NotDeleted },
      ],
    });
    if (!res) {
      return null;
    }
    return res;
  }

  async findByCode(code: string): Promise<User | null> {
    const res = await this.usersRepo.findOne({
      where: {
        confirmationCode: code,
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });
    if (!res) {
      return null;
    }
    return res;
  }

  async save(user: User): Promise<string> {
    const res = await this.usersRepo.save(user);
    return res.id.toString();
  }

  async findByLoginAndEmail(login: string, email: string) {
    const res = await this.usersRepo.findOne({
      where: [
        { email, deletionStatus: DeletionStatus.NotDeleted },
        { login, deletionStatus: DeletionStatus.NotDeleted },
      ],
    });
    if (!res) {
      return null;
    }
    return res;
  }
}
