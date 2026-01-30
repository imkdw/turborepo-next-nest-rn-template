import { ApiProperty } from '@nestjs/swagger';
import { USER_NAME_MAX_LENGTH } from '@repo/consts';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', maxLength: USER_NAME_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_NAME_MAX_LENGTH)
  name: string;
}
