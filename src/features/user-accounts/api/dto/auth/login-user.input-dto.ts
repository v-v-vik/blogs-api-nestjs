import { LoginUserDto } from '../../../dto/user.main-dto';
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim-decorator';

export class LoginUserInputDto implements LoginUserDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @MinLength(3)
  loginOrEmail: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
