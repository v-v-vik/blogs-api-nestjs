import { UserDocument } from '../../../domain/user.entity';

export class InfoUserViewDto {
  email: string;
  login: string;
  userId: string;

  constructor(user: UserDocument) {
    this.email = user.accountData.email;
    this.login = user.accountData.login;
    this.userId = user._id.toString();
  }
}
