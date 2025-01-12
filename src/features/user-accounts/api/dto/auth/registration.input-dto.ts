import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim-decorator';

export class RegistrationConfirmationCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  code: string;
}

export class RegistrationEmailResendingDto {
  @Trim()
  @IsString()
  @IsEmail()
  email: string;
}
