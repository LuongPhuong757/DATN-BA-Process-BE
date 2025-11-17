import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ImageProcessingResult } from './src/entities/image-processing-result.entity';
import { ProcessedItem } from './src/entities/processed-item.entity';
import { Screen } from './src/entities/screen.entity';
import { Project } from './src/entities/project.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', 'Phuongkya123!'),
  database: configService.get('DB_DATABASE', 'image_processor_db'),
  entities: [ImageProcessingResult, ProcessedItem, Screen, Project],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Disable synchronize when using migrations
  logging: true,
});
