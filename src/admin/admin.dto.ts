import { IsString, IsNotEmpty } from 'class-validator';
import { OmitType, PickType } from '@nestjs/mapped-types';

class AdminDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateAdminDto extends OmitType(AdminDto, ['id']) {}
export class LoginAdminDto extends PickType(AdminDto, [
  'username',
  'password',
]) {}
