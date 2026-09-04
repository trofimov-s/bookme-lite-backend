import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import type { JwtPayload } from '../models';

export const CurrentUser = createParamDecorator((_, context: ExecutionContext): JwtPayload => {
  const request = context.switchToHttp().getRequest<Request>();

  return request.user!;
});
