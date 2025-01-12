import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/user.query-repository';
import { AuthService } from '../application/auth.service';
import { CreateUserInputDto } from './dto/user.input-dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/param/user-from-req.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import {
  RegistrationConfirmationCodeDto,
  RegistrationEmailResendingDto,
} from './dto/auth/registration.input-dto';
import {
  NewPasswordRecoveryInputDto,
  PasswordRecoveryEmailDto,
} from './dto/auth/password-recovery.input-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    //@Request() req: any -- to get ip, userAgent
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.loginUser(user.id); // ip, userAgent)
  }

  @Post('registration')
  async registerUser(@Body() dto: CreateUserInputDto) {
    return this.userService.register(dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async about(@ExtractUserFromRequest() user: UserContextDto) {
    return this.usersQueryRepository.aboutMeInfo(user.id);
  }

  @Post('registration-confirmation')
  async confirmRegistration(@Body() dto: RegistrationConfirmationCodeDto) {
    return this.authService.confirmRegistration(dto.code);
  }
  @Post('registration-email-resending')
  async resendConfirmationEmail(@Body() dto: RegistrationEmailResendingDto) {
    return this.authService.resendConfirmationEmail(dto.email);
  }

  @Post('password-recovery')
  async recoverPassword(@Body() dto: PasswordRecoveryEmailDto) {
    return this.authService.passwordRecovery(dto.email);
  }

  @Post('new-password')
  async changePassword(@Body() dto: NewPasswordRecoveryInputDto) {
    return this.authService.passwordUpdate(dto.newPassword, dto.recoveryCode);
  }
}
