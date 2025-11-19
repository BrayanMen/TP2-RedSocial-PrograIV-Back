import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from '../services/jwt-token.service';
import { Request, Response } from 'express';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class RefreshTokenUseCases {
  constructor(private readonly jwtTokenService: JwtTokenService) {}
  async execute(refreshToken: string, res: Response): Promise<AuthResponseDto> {
    const oldToken = refreshToken;

    if (!oldToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const payload = await this.jwtTokenService.verifyRefreshToken(oldToken);
    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };

    const token = await this.jwtTokenService.generateToken(newPayload);
    const newRefreshToken =
      await this.jwtTokenService.generateRefreshToken(newPayload);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return {
      token,
      refreshToken: newRefreshToken,
      expiresIn: this.jwtTokenService.getTokenExpirationTime(),
    };
  }
}
