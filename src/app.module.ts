import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageProcessingController } from './controllers/image-processing.controller';
import { ImageProcessingService } from './services/image-processing.service';
import { ImageProcessingResult } from './entities/image-processing-result.entity';
import { ProcessedItem } from './entities/processed-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [ImageProcessingResult, ProcessedItem],
          migrations: ['dist/migrations/*.js'],
          migrationsTableName: 'migrations',
          synchronize: false, // Disable synchronize when using migrations
          logging: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ImageProcessingResult, ProcessedItem]),
  ],
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService],
})
export class AppModule { }
