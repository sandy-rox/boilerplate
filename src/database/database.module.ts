// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Retrieve the database dialect from configuration
        const dbDialect = configService.get<string>('db.dialect');
        // Define allowed database dialects for validation
        const validDialects = [
          'postgres',
          'mysql',
          'sqlite',
          'mariadb',
          'oracle',
          'mssql',
        ] as const;

        if (
          !validDialects.includes(dbDialect as (typeof validDialects)[number])
        ) {
          throw new Error(`Invalid database dialect : ${dbDialect}`);
        }

        // Define the database configuration for TypeORM
        const dbConfig = {
          type: dbDialect as (typeof validDialects)[number],
          host: configService.get<string>('db.host'),
          port: configService.get<number>('db.port'),
          database: configService.get<string>('db.name'),
          username: configService.get<string>('db.username'),
          password: configService.get<string>('db.password'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
          migrations: [],
          extra: {
            max: 10,
            min: 2,
            idleTimeoutMillis: 30000,
          },
        };
        return dbConfig;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
