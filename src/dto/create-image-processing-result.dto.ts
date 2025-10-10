import { IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessedItemDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;

  @IsString()
  type: string;

  @IsString()
  database: string;

  @IsString()
  description: string;

  // Add these fields to match the actual payload
  @IsOptional()
  @IsNumber()
  itemId?: number;

  @IsOptional()
  @IsNumber()
  imageProcessingResultId?: number;

  // Add dataType and dbField fields from payload
  @IsOptional()
  @IsString()
  dataType?: string;

  @IsOptional()
  @IsString()
  dbField?: string;
}

export class CreateImageProcessingResultDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessedItemDto)
  results: ProcessedItemDto[];

  @IsString()
  timestamp: string;

  @IsString()
  source: string;

  @IsString()
  title: string;

  @IsString()
  body: string;
}
