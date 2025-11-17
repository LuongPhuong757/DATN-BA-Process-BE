import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScreenDto {
  @ApiProperty({
    description: 'New name for the screen',
    example: 'Updated Screen Name',
  })
  @IsString()
  @IsNotEmpty()
  screenName: string;
}

