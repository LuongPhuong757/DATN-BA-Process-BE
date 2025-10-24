import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ImageProcessingResult } from './image-processing-result.entity';

@Entity('processed_items')
export class ProcessedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  stt: number;

  @Column({ type: 'int' })
  itemId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 100 })
  database: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  imageProcessingResultId: number;

  // Add dataType and dbField columns
  @Column({ type: 'varchar', length: 50, nullable: true })
  dataType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dbField: string;

  @ManyToOne(() => ImageProcessingResult, imageProcessingResult => imageProcessingResult.processedItems)
  @JoinColumn({ name: 'imageProcessingResultId' })
  imageProcessingResult: ImageProcessingResult;
}


