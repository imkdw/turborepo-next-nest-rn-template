import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Milk, eggs, bread', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}
