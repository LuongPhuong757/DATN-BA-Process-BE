import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ProcessedItem } from './processed-item.entity';
import { Screen } from './screen.entity';

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

  @Column({ type: 'int' })
  screenId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  urlSheet: string;

  @ManyToOne(() => Screen, screen => screen.imageProcessingResults)
  @JoinColumn({ name: 'screenId' })
  screen: Screen;

  @OneToMany(() => ProcessedItem, processedItem => processedItem.imageProcessingResult)
  processedItems: ProcessedItem[];
}


