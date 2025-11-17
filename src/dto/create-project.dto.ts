import { IsString, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'My Project',
  })
  @IsString()
  @IsNotEmpty()
  nameProject: string;

  @ApiProperty({
    description: 'Array of screen names to create',
    example: ['Screen 1', 'Screen 2', 'Screen 3'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  screens: string[];
}

