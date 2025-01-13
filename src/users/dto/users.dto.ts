import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role, Gender, Status } from '../schema/users.schemas';
import { OmitType } from '@nestjs/mapped-types';

class UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}
