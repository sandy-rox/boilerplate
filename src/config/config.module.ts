import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { configurationSchema } from './config.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: configurationSchema,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
