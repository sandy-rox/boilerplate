import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  getAppConfig() {
    return this.configService.get('app');
  }

  getDatabaseConfig() {
    return this.configService.get('database');
  }

  getJwtConfig() {
    return this.configService.get('jwt');
  }

  getLoggerConfig() {
    return this.configService.get('logger');
  }
}
