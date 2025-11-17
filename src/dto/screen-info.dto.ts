import { ApiProperty } from '@nestjs/swagger';

export class ScreenInfoDto {
  @ApiProperty({
    description: 'ID of the screen',
    example: 1,
  })
  screenId: number;

  @ApiProperty({
    description: 'Name of the screen',
    example: 'Screen 1',
  })
  screenName: string;

  @ApiProperty({
    description: 'Name of the project that contains this screen',
    example: 'My Project',
  })
  projectName: string;

  @ApiProperty({
    description: 'Number of image processing results in this screen',
    example: 5,
  })
  imageProcessingCount: number;
}

