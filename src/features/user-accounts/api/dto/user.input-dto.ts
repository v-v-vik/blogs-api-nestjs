import { CreateUserModel } from '../../domain/dto/user.create-dto';

export class CreateUserInputModel implements CreateUserModel {
  login: string;
  password: string;
  email: string;
}
