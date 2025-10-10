import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ProcessedItem } from './processed-item.entity';

@Entity('image_processing_results')
export class ImageProcessingResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 100 })
  source: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ProcessedItem, processedItem => processedItem.imageProcessingResult)
  processedItems: ProcessedItem[];
}


