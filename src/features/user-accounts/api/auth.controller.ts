import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
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
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { Response, Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../application/useCases/login-user.usercase';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';
import { RefreshTokenCommand } from '../application/useCases/refresh-token.usecase';
import { RtJwtAuthGuard } from '../guards/refresh-token/rt-jwt-auth.guard';
import { ExtractPayloadFromRequest } from '../guards/decorators/param/rt-payload-from-req.decorator';
import { RefreshTokenPayload } from '../dto/tokens/tokens-payload.dto';
import { LogoutUserCommand } from '../application/useCases/logout-user.usecase';
import { SkipThrottle } from '@nestjs/throttler';
import { UsersQueryRepository } from '../infrastructure/user.query-repository';
import { CreateUserInputDto } from './dto/user.input-dto';
import { RegisterUserCommand } from '../application/useCases/register-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sqlUsersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent = request.headers['user-agent'] || 'unknown device';
    if (request.ip) {
      return await this.commandBus.execute(
        new LoginUserCommand(user.id, response, request.ip, userAgent),
      );
    }
    throw UnauthorizedDomainException.create('No IP address indicated');
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() dto: CreateUserInputDto) {
    return this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async about(@ExtractUserFromRequest() user: UserContextDto) {
    return this.sqlUsersQueryRepository.aboutMeInfo(user.id);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() dto: RegistrationConfirmationCodeDto) {
    return this.authService.confirmRegistration(dto.code);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendConfirmationEmail(@Body() dto: RegistrationEmailResendingDto) {
    return this.authService.resendConfirmationEmail(dto.email);
  }

  @Post('password-recovery')
  async recoverPassword(@Body() dto: PasswordRecoveryEmailDto) {
    return this.authService.passwordRecovery(dto.email);
  }

  @Post('new-password')
  async changePassword(@Body() dto: NewPasswordRecoveryInputDto) {
    console.log('at controller:', dto);
    return this.authService.passwordUpdate(dto.newPassword, dto.recoveryCode);
  }

  @Post('logout')
  @UseGuards(RtJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @ExtractPayloadFromRequest() tokenPayload: RefreshTokenPayload,
  ) {
    return this.commandBus.execute(
      new LogoutUserCommand(tokenPayload.deviceId, response),
    );
  }

  @SkipThrottle()
  @Post('refresh-token')
  @UseGuards(RtJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @ExtractPayloadFromRequest() tokenPayload: RefreshTokenPayload,
  ) {
    return this.commandBus.execute(
      new RefreshTokenCommand(tokenPayload, response),
    );
  }
}
