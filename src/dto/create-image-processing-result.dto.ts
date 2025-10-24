import { IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsNumberString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ProcessedItemDto {
  // Remove validation for id completely - let frontend send any value
  id?: any;

  @IsOptional()
  @IsNumber()
  stt?: number;

  @IsString()
  content: string;

  @IsString()
  type: string;

  @IsString()
  database: string;

  @IsString()
  description: string;

  // Remove validation for itemId completely - let frontend send any value
  itemId?: any;

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

export class UpdateImageProcessingResultDto {
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
