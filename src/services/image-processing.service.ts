import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageProcessingResult } from '../entities/image-processing-result.entity';
import { ProcessedItem } from '../entities/processed-item.entity';
import { CreateImageProcessingResultDto, UpdateImageProcessingResultDto } from '../dto/create-image-processing-result.dto';

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
      screenId: createDto.screenId,
      imageUrl: createDto.imageUrl,
      urlSheet: createDto.urlSheet,
    });

    const savedResult = await this.imageProcessingResultRepository.save(imageProcessingResult);

    // Create processed items
    const processedItems = createDto.results.map(item => 
      this.processedItemRepository.create({
        stt: item.stt, // Map stt from frontend instead of id
        itemId: item.itemId || 0, // Use itemId from frontend or default to 0
        content: item.content,
        type: item.type,
        database: item.database,
        description: item.description,
        imageProcessingResultId: savedResult.id,
        dataType: item.dataType,
        dbField: item.dbField,
        io: item.io,
        required: item.required,
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
    const results = await this.imageProcessingResultRepository.find({
      relations: ['processedItems', 'screen', 'screen.project'],
      order: { createdAt: 'DESC' },
    });

    // Replace title with projectName and source with screenName
    return results.map(result => ({
      ...result,
      title: result.screen?.project?.name || result.title,
      source: result.screen?.name || result.source,
    }));
  }

  async getImageProcessingResultById(id: number): Promise<ImageProcessingResult> {
    return this.imageProcessingResultRepository.findOne({
      where: { id },
      relations: ['processedItems'],
    });
  }

  async updateImageProcessingResult(id: number, updateDto: UpdateImageProcessingResultDto): Promise<ImageProcessingResult> {
    // Check if the record exists
    const existingResult = await this.imageProcessingResultRepository.findOne({
      where: { id },
      relations: ['processedItems'],
    });

    if (!existingResult) {
      throw new Error(`ImageProcessingResult with id ${id} not found`);
    }

    // Update main result record
    await this.imageProcessingResultRepository.update(id, {
      title: updateDto.title,
      body: updateDto.body,
      source: updateDto.source,
      timestamp: new Date(updateDto.timestamp),
      imageUrl: updateDto.imageUrl,
      urlSheet: updateDto.urlSheet,
    });

    // Delete existing processed items
    await this.processedItemRepository.delete({ imageProcessingResultId: id });

    // Create new processed items
    const processedItems = updateDto.results.map(item => 
      this.processedItemRepository.create({
        stt: item.stt,
        itemId: item.itemId || 0,
        content: item.content,
        type: item.type,
        database: item.database,
        description: item.description,
        imageProcessingResultId: id,
        dataType: item.dataType,
        dbField: item.dbField,
        io: item.io,
        required: item.required,
      })
    );

    await this.processedItemRepository.save(processedItems);

    // Return updated result with items
    return this.imageProcessingResultRepository.findOne({
      where: { id },
      relations: ['processedItems'],
    });
  }
}


