import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { CoreConfig } from '../../../../core/core.config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername: string;
  private readonly validPassword: string;
  constructor(
    private reflector: Reflector,
    private coreConfig: CoreConfig,
  ) {
    const [username, password] = this.coreConfig.adminCredentials.split(':');
    this.validUsername = username;
    this.validPassword = password;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException();
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');

    if (username === this.validUsername && password === this.validPassword) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
