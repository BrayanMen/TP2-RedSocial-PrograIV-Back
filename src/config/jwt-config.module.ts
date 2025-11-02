import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): { secret: string; signOptions: any } => {
        const jwtConf = configService.get<ConfigType<typeof jwtConfig>>('jwt');

        if (!jwtConf || !jwtConf.secret) {
          throw new Error('JWT_SECRET no está definido en .env');
        }

        return {
          secret: jwtConf.secret,
          signOptions: { expiresIn: jwtConf.expiresIn },
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'CONFIGURATION(jwt)',
      useFactory: (configService: ConfigService) =>
        configService.get<ConfigType<typeof jwtConfig>>('jwt'),
      inject: [ConfigService],
    },
  ],
  exports: ['CONFIGURATION(jwt)', JwtModule, ConfigModule],
})
export class JwtConfigRootModule {}
