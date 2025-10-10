import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageProcessingResult } from '../entities/image-processing-result.entity';
import { ProcessedItem } from '../entities/processed-item.entity';
import { CreateImageProcessingResultDto } from '../dto/create-image-processing-result.dto';

@Injectable()
export class ImageProcessingService {
  constructor(
    @InjectRepository(ImageProcessingResult)
    private imageProcessingResultRepository: Repository<ImageProcessingResult>,
    @InjectRepository(ProcessedItem)
    private processedItemRepository: Repository<ProcessedItem>,
  ) {}

  async createImageProcessingResult(createDto: CreateImageProcessingResultDto): Promise<ImageProcessingResult> {
    // Create main result record
    const imageProcessingResult = this.imageProcessingResultRepository.create({
      title: createDto.title,
      body: createDto.body,
      source: createDto.source,
      timestamp: new Date(createDto.timestamp),
    });

    const savedResult = await this.imageProcessingResultRepository.save(imageProcessingResult);

    // Create processed items
    const processedItems = createDto.results.map(item => 
      this.processedItemRepository.create({
        itemId: item.id,
        content: item.content,
        type: item.type,
        database: item.database,
        description: item.description,
        imageProcessingResultId: savedResult.id,
        dataType: item.dataType,
        dbField: item.dbField,
      })
    );

    await this.processedItemRepository.save(processedItems);

    // Return result with items
    return this.imageProcessingResultRepository.findOne({
      where: { id: savedResult.id },
      relations: ['processedItems'],
    });
  }

  async getAllImageProcessingResults(): Promise<ImageProcessingResult[]> {
    return this.imageProcessingResultRepository.find({
      relations: ['processedItems'],
      order: { createdAt: 'DESC' },
    });
  }

  async getImageProcessingResultById(id: number): Promise<ImageProcessingResult> {
    return this.imageProcessingResultRepository.findOne({
      where: { id },
      relations: ['processedItems'],
    });
  }
}


