import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from '../constants/error-message.constant';

import type { ConfigType } from '@nestjs/config';
import { JwtPayload } from '../interface/jwt-payload.interface';
import jwtConfig from '../../config/jwt.config';

const PUBLIC_PATHS = ['/', '/favicon.ico'];

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { cookies: Record<string, string> }>();

    if (PUBLIC_PATHS.includes(req.url)) {
      return true;
    }

    // const token = this.getTokenHeader(req);
    const token = req.cookies?.jwt;
    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
    try {
      const checkToken = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtConf.secret,
      });
      req['user'] = checkToken;
      return true;
    } catch (error) {
      console.error('Error: ', error);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
  private getTokenHeader(req: Request): string | undefined {
    const authHeader = req.headers['authorization'] as string | undefined;

    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
