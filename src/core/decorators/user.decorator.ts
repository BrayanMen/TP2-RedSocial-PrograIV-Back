import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interface/jwt-payload.interface';

export const ActualUser = createParamDecorator(
  (
    userData: keyof JwtPayload,
    context: ExecutionContext,
  ): JwtPayload | JwtPayload[keyof JwtPayload] | undefined => {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const user = req.user;
    if (!user) return undefined;
    return userData ? user[userData] : user;
  },
);
