import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ImageProcessingService } from '../services/image-processing.service';
import { CreateImageProcessingResultDto } from '../dto/create-image-processing-result.dto';
import { ImageProcessingResult } from '../entities/image-processing-result.entity';

@Controller('posts')
export class ImageProcessingController {
  constructor(private readonly imageProcessingService: ImageProcessingService) {}

  @Post()
  async createImageProcessingResult(
    @Body() createDto: CreateImageProcessingResultDto,
  ): Promise<ImageProcessingResult> {
    return this.imageProcessingService.createImageProcessingResult(createDto);
  }

  @Get()
  async getAllImageProcessingResults(): Promise<ImageProcessingResult[]> {
    return this.imageProcessingService.getAllImageProcessingResults();
  }

  @Get(':id')
  async getImageProcessingResultById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ImageProcessingResult> {
    return this.imageProcessingService.getImageProcessingResultById(id);
  }
}
