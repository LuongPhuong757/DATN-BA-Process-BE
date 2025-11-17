import { Controller, Post, Get, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ImageProcessingService } from '../services/image-processing.service';
import { CreateImageProcessingResultDto, UpdateImageProcessingResultDto } from '../dto/create-image-processing-result.dto';
import { ImageProcessingResult } from '../entities/image-processing-result.entity';

@ApiTags('posts')
@Controller('posts')
export class ImageProcessingController {
  constructor(private readonly imageProcessingService: ImageProcessingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new image processing result' })
  @ApiBody({
    type: CreateImageProcessingResultDto,
    examples: {
      example1: {
        summary: 'Example: Create image processing result',
        value: {
          title: 'Image Processing Title',
          body: 'Body content text',
          source: 'image_source',
          timestamp: '2024-01-01T00:00:00.000Z',
          screenId: 1,
          results: [
            {
              stt: 1,
              content: 'Sample content',
              type: 'text',
              database: 'database_name',
              description: 'Description text',
              dataType: 'string',
              dbField: 'field_name',
            },
            {
              stt: 2,
              content: 'Another content',
              type: 'number',
              database: 'database_name',
              description: 'Another description',
              dataType: 'integer',
              dbField: 'another_field',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image processing result created successfully',
    type: ImageProcessingResult,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createImageProcessingResult(
    @Body() createDto: CreateImageProcessingResultDto,
  ): Promise<ImageProcessingResult> {
    return this.imageProcessingService.createImageProcessingResult(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all image processing results' })
  @ApiResponse({
    status: 200,
    description: 'List of all image processing results',
    type: [ImageProcessingResult],
  })
  async getAllImageProcessingResults(): Promise<ImageProcessingResult[]> {
    return this.imageProcessingService.getAllImageProcessingResults();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image processing result by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Image processing result ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Image processing result found',
    type: ImageProcessingResult,
  })
  @ApiResponse({ status: 404, description: 'Image processing result not found' })
  async getImageProcessingResultById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ImageProcessingResult> {
    return this.imageProcessingService.getImageProcessingResultById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an image processing result' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Image processing result ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateImageProcessingResultDto,
    examples: {
      example1: {
        summary: 'Example: Update image processing result',
        value: {
          title: 'Updated Image Processing Title',
          body: 'Updated body content text',
          source: 'updated_image_source',
          timestamp: '2024-01-01T00:00:00.000Z',
          results: [
            {
              stt: 1,
              content: 'Updated content',
              type: 'text',
              database: 'database_name',
              description: 'Updated description',
              dataType: 'string',
              dbField: 'field_name',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image processing result updated successfully',
    type: ImageProcessingResult,
  })
  @ApiResponse({ status: 404, description: 'Image processing result not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateImageProcessingResult(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateImageProcessingResultDto,
  ): Promise<ImageProcessingResult> {
    return this.imageProcessingService.updateImageProcessingResult(id, updateDto);
  }
}
