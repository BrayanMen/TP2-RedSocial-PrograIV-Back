import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { rateLimit } from 'express-rate-limit';
import { ResponseInterceptor } from './core/interceptors/ResponseInterceptor.interceptor';
import { HttpExceptionFilter } from './core/filters/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Instancia para leer variables de entorno
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX') ?? 'api/v1';
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  app.setGlobalPrefix(apiPrefix);

  //Seguridad
  app.use(helmet());
  app.use(cookieParser());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  //Rate limit para evitar ataques spam
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 150,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  //CORS

  const corsOrigin =
    configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:4200';
  const origins = corsOrigin.split(',').map((origin) => origin.trim());
  app.enableCors({
    origin: origins.length > 1 ? origins : origins[0],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
  });
  //Pipes para limpieza de datos y DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: nodeEnv === 'production' ? true : false,
    }),
  );
  // Filtro de excepciones y interceptor de solicitudes HTTP y
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const configSwagger = new DocumentBuilder()
    .setTitle('Oss! Social Network API')
    .setDescription(
      'API para red social de artistas marciales y atletas de combate ' +
        'Permite a los usuarios compartir contenido, seguirse entre sí ' +
        'y conectar con otros artistas marciales. ',
    )
    .addTag('Autenticación', 'Endpoints de registro, login y gestión de tokens')
    .addTag('Usuarios', 'Gestión de perfiles y usuarios')
    .addTag('Publicaciones', 'Crear, listar y eliminar publicaciones')
    .addTag('Likes', 'Dar y quitar me gusta en publicaciones')
    .addTag('Comentarios', 'Crear, listar y editar comentarios')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, documentSwagger, {
    customSiteTitle: 'Oss! Social Network API',
  });
  //Hook para cerrar conexiones
  app.enableShutdownHooks();
  //Servidor levantando
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║       Oss! Red Social - API REST                          ║
  ║                                                           ║
  ║   Servidor corriendo en: http://localhost:${port}            ║
  ║   Documentación API: http://localhost:${port}/api/docs       ║
  ║   Entorno: ${nodeEnv}                                    ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}
export default bootstrap();
