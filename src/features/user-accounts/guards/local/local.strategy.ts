import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application/auth.service';
import { UserContextDto } from '../dto/user-context.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }
  async validate(username: string, password: string): Promise<UserContextDto> {
    const user = await this.authService.checkCredentials(username, password);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }
}
