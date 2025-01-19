import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application/auth.service';
import { UserContextDto } from '../dto/user-context.dto';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }
  async validate(username: string, password: string): Promise<UserContextDto> {
    const user = await this.authService.checkCredentials(username, password);
    if (!user) {
      throw UnauthorizedDomainException.create('User not found.');
    }
    return user;
  }
}
