import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AuthModule,
  CategoryModule,
  CountryDepartmentModule,
  ProfessionalUserModule,
  ServiceModule,
  ServiceRequestModule,
  UserModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: parseInt(configService.get<string>('POSTGRES_PORT'), 10),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        ssl: {
          rejectUnauthorized: true,
          ca: configService.get<string>('POSTGRES_SSL_CA'),
        },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CountryDepartmentModule,
    UserModule,
    CategoryModule,
    ServiceModule,
    ProfessionalUserModule,
    ServiceRequestModule
  ],
})
export class AppModule {}
