import { CreateUserDto } from '../../dto/user.main-dto';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim-decorator';

export class CreateUserInputDto implements CreateUserDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(3, 10)
  login: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @Trim()
  @IsEmail()
  email: string;
}
