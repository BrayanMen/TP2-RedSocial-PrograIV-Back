import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        const dbUrl = configService.get<string>('MONGO_URI');
        if (!dbUrl) {
          throw new Error(
            'URI no definida, La conexion a la DB no puede iniciarse',
          );
        }
        return {
          uri: dbUrl,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoConfigRootModule {}
