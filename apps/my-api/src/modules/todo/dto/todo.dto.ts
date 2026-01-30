import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  @ApiProperty({ description: 'Todo ID', example: 'uuid-1234-5678' })
  id: string;

  @ApiProperty({ description: '제목', example: 'Buy groceries' })
  title: string;

  @ApiProperty({ description: '내용', example: 'Milk, eggs, bread', required: false })
  content: string | null;

  @ApiProperty({ description: '완료 여부', example: false })
  completed: boolean;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  updatedAt: Date;
}
