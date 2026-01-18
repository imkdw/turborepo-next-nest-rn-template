import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: '유저 ID', example: 'uuid-1234-5678' })
  id: string;

  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '이름', example: 'John Doe' })
  name: string;
}
