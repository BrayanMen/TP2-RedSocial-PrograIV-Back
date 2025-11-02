import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-key',
  expiresIn: (process.env.JWT_EXPIRES ||
    '15m') as `${number}${'m' | 'h' | 'd'}`,
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES ||
    '7d') as `${number}${'m' | 'h' | 'd'}`,
}));
