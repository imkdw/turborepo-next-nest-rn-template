import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({ example: 'Buy groceries', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Milk, eggs, bread', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
