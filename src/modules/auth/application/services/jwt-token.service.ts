import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../../../config/jwt.config';
import { ERROR_MESSAGES } from '../../../../core/constants/error-message.constant';
import { JwtPayload } from '../../../../core/interface/jwt-payload.interface';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
  ) {}

  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync<JwtPayload>(payload, {
      secret: this.jwtConf.secret,
      expiresIn: this.jwtConf.expiresIn,
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync<JwtPayload>(payload, {
      secret: this.jwtConf.refreshSecret,
      expiresIn: this.jwtConf.refreshExpiresIn,
    });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.jwtConf.secret,
      });
    } catch (error) {
      console.error('Error: ', error);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.jwtConf.refreshSecret,
      });
    } catch (error) {
      console.error('Error: ', error);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  decodeToken(token: string): JwtPayload {
    const decoded: string | object | null = this.jwtService.decode(token);
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Invalid token payload');
    }

    return decoded as JwtPayload;
  }

  getTokenExpirationTime(): number {
    const expiresIn = this.jwtConf.expiresIn;
    if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn) * 60;
    }
    if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn) * 3600;
    }
    if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn) * 86400;
    }
    return parseInt(expiresIn);
  }
}
