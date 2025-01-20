import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  //const clustering = configService.get<boolean>('app.clustering');
  const basePath = configService.get<string>('app.base_path');
  const port = configService.get<number>('app.port');

  app.enableVersioning();
  app.enableCors();
  app.setGlobalPrefix(basePath);

  await app.listen(port);
}

bootstrap();
