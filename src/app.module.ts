import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestMiddleware } from './middlewares/request.middleware';
import { UserModule } from './modules/user/user.module';
import { LoggerModule } from './common/logger/logger.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, LoggerModule, ConfigModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(configService: ConfigService) {
    console.log('Loaded configuration:', configService.get('app.name')); // Debugging line to check if the configuration is loaded properly
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*'); // Apply to all routes or specify specific routes
  }
}
