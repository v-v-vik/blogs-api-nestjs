import { CreateUserDto } from '../../dto/user.create-dto';

export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}
