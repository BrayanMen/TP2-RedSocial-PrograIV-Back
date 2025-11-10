import { Module } from '@nestjs/common';
import { ConfigEnvRootModule } from './config/enviroment-config.module';
import { MongoConfigRootModule } from './config/db-config.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary-module.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DataModule } from './modules/data/data.module';
import { PublicationsModule } from './modules/publications/publications.module';

@Module({
  imports: [
    ConfigEnvRootModule,
    MongoConfigRootModule,
    CloudinaryModule,
    UsersModule,
    AuthModule,
    DataModule,
    PublicationsModule,
  ],
})
export class AppModule {}
