import { User } from '../../domain/user.entity';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  constructor(user: User) {
    this.id = user.id.toString();
    this.login = user.login;
    this.email = user.email;
    this.createdAt = user.createdAt.toISOString();
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
