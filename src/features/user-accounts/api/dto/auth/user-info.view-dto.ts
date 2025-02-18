import { UserSQLDto } from '../../../domain/dto/user.sql-dto';

export class InfoUserViewDto {
  email: string;
  login: string;
  userId: string;

  constructor(user: UserSQLDto) {
    this.email = user.email;
    this.login = user.login;
    this.userId = user.id.toString();
  }
}
