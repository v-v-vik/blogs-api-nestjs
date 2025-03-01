import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt-access') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    // info: any,
    // context: ExecutionContext,
    // status?: any,
  ) {
    ////https://docs.nestjs.com/recipes/passport#extending-guards
    // super.handleRequest(err, user, info, context, status);
    // handleRequest(err, user, info, context, status) {
    //   if (err || !user) {
    //     throw err || new common_1.UnauthorizedException();
    //   }
    //   return user;
    // }
    if (err || !user) {
      return null;
    } else {
      return user;
    }
  }
}
