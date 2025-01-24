import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshTokenPayload } from '../../../dto/tokens/tokens-payload.dto';

export const ExtractPayloadFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): RefreshTokenPayload => {
    const request = context.switchToHttp().getRequest();
    const payload = request.user;
    if (!payload) {
      throw new Error('there is no payload in the request object');
    }
    return payload;
  },
);
