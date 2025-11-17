import { IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsNumberString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessedItemDto {
  @ApiPropertyOptional({
    description: 'Item ID',
    example: 1,
  })
  id?: any;

  @ApiPropertyOptional({
    description: 'Sequence number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  stt?: number;

  @ApiProperty({
    description: 'Content of the processed item',
    example: 'Sample content text',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Type of the processed item',
    example: 'text',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Database name',
    example: 'database_name',
  })
  @IsString()
  database: string;

  @ApiProperty({
    description: 'Description of the processed item',
    example: 'This is a description',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Item ID',
    example: 123,
  })
  itemId?: any;

  @ApiPropertyOptional({
    description: 'Image processing result ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  imageProcessingResultId?: number;

  @ApiPropertyOptional({
    description: 'Data type',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  dataType?: string;

  @ApiPropertyOptional({
    description: 'Database field name',
    example: 'field_name',
  })
  @IsOptional()
  @IsString()
  dbField?: string;
}

export class CreateImageProcessingResultDto {
  @ApiProperty({
    description: 'Array of processed items',
    type: [ProcessedItemDto],
    example: [
      {
        stt: 1,
        content: 'Sample content',
        type: 'text',
        database: 'database_name',
        description: 'Description text',
        dataType: 'string',
        dbField: 'field_name',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessedItemDto)
  results: ProcessedItemDto[];

  @ApiProperty({
    description: 'Timestamp of the processing',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsString()
  timestamp: string;

  @ApiProperty({
    description: 'Source of the image',
    example: 'image_source',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'Title of the processing result',
    example: 'Image Processing Title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Body content of the processing result',
    example: 'Body content text',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'ID of the screen that contains this image processing result',
    example: 1,
  })
  @IsNumber()
  screenId: number;
}

export class UpdateImageProcessingResultDto {
  @ApiProperty({
    description: 'Array of processed items',
    type: [ProcessedItemDto],
    example: [
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
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessedItemDto)
  results: ProcessedItemDto[];

  @ApiProperty({
    description: 'Timestamp of the processing',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsString()
  timestamp: string;

  @ApiProperty({
    description: 'Source of the image',
    example: 'image_source',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'Title of the processing result',
    example: 'Updated Image Processing Title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Body content of the processing result',
    example: 'Updated body content text',
  })
  @IsString()
  body: string;
}
