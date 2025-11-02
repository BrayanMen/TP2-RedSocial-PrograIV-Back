import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '../constants/roles.constant';
import { ERROR_MESSAGES } from '../constants/error-message.constant';
import { Request } from 'express';
import { JwtPayload } from '../interface/jwt-payload.interface';

interface AuthUserReq extends Request {
  user?: JwtPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  // Reflector sirve para leer los metadatos que generan los decoradores
  canActivate(context: ExecutionContext): boolean {
    const rolesRequired = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const { user } = context.switchToHttp().getRequest<AuthUserReq>();
    const role = rolesRequired.some((role) => user?.role === role);

    if (!rolesRequired) return true;
    if (!user) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }
    if (!role) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return true;
  }
}
