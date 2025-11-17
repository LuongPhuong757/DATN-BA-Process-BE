import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { Project } from './project.entity';
import { ImageProcessingResult } from './image-processing-result.entity';

@Entity('screens')
@Index('IDX_screens_name_projectId', ['name', 'projectId'], { unique: true })
export class Screen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  projectId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, project => project.screens)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => ImageProcessingResult, imageProcessingResult => imageProcessingResult.screen)
  imageProcessingResults: ImageProcessingResult[];
}

