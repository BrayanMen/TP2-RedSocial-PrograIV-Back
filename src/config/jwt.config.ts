import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'FATAL: JWT_SECRET no está definido en las variables de entorno.',
    );
  }
  return {
    secret: process.env.JWT_SECRET,
    expiresIn: (process.env.JWT_EXPIRES ||'15m') as `${number}${'m' | 'h' | 'd'}`,
    refreshSecret: process.env.JWT_REFRESH_SECRET ,
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES ||
    '7d') as `${number}${'m' | 'h' | 'd'}`,    
  };
});

