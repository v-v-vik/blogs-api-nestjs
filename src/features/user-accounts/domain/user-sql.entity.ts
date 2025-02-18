import { CreateUserDomainDto } from './dto/user.domain-dto';
import { DeletionStatus } from '../../../core/dto/deletion-status.enum';
import { AccountStatus } from './user.entity';
import { randomUUID } from 'node:crypto';
import add from 'date-fns/add';
import { UserSQLDto } from './dto/user.sql-dto';

export class User {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  confirmationCode: string;
  confirmCodeExpiryDate: Date;
  status: number;
  deletionStatus: string;

  static createNewInstance(dto: CreateUserDomainDto) {
    const user = new this();
    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.confirmationCode = randomUUID();
    user.confirmCodeExpiryDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
    user.status = AccountStatus.NotConfirmed;
    user.deletionStatus = DeletionStatus.NotDeleted;
    return user as User;
  }

  static createFromExistingDataInstance(dbUser: UserSQLDto) {
    const user = new this();
    user.id = dbUser.id.toString();
    user.login = dbUser.login;
    user.email = dbUser.email;
    user.passwordHash = dbUser.passwordHash;
    user.createdAt = dbUser.createdAt;
    user.confirmationCode = dbUser.confirmationCode;
    user.confirmCodeExpiryDate = dbUser.confirmCodeExpiryDate;
    user.status = dbUser.status;
    user.deletionStatus = dbUser.deletionStatus;
    return user as User;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('User already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  flagAsConfirmed() {
    if (this.status === AccountStatus.Confirmed) {
      throw new Error('User already confirmed');
    }
    this.status = AccountStatus.Confirmed;
  }

  updateCode(code: string) {
    this.confirmationCode = code;
    this.confirmCodeExpiryDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
  }

  updatePassword(hashedPassword: string) {
    this.passwordHash = hashedPassword;
  }
}
