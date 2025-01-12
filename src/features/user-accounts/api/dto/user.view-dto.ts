import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  constructor(user: UserDocument) {
    this.id = user._id.toString();
    this.login = user.accountData.login;
    this.email = user.accountData.email;
    this.createdAt = user.accountData.createdAt;
  }

  // static mapToView(user: UserDocument): UserViewModel {
  //   const dto = new UserViewModel();
  //
  //   dto.email = user.email;
  //   dto.login = user.login;
  //   dto.email = user.email;
  //   dto.createdAt = user.createdAt;
  //
  //   return dto;
  // }
}
