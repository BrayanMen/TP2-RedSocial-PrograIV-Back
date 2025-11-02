import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //vuelve el modulo Global
      load: [jwtConfig],
      envFilePath: '.env', //Ubica el archivo
      cache: true, //Guarda la info del env para no repetir lecturas
    }),
  ],
})
export class ConfigEnvRootModule {}
