import { Trim } from '../../../../../core/decorators/trim-decorator';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class PasswordRecoveryEmailDto {
  @Trim()
  @IsString()
  @IsEmail()
  email: string;
}

export class NewPasswordRecoveryInputDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  recoveryCode: string;
}
