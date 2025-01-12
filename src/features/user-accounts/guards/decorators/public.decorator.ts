import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

//isPublic() decorator is set for the endpoints which does not need authentication
// when AuthGuard is set at the controller level.
