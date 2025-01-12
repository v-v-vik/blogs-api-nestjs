export class CreateUserDto {
  login: string;
  email: string;
  password: string;
}
// export class UpdateUserDto {
//   email: string;
// }

export class LoginUserDto {
  loginOrEmail: string;
  password: string;
}
