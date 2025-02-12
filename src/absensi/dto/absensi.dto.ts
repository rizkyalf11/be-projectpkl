import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class KehadiranItemDto {
  @IsString()
  tgl: string;

  @IsString()
  status: string;
}

class KehadiranDto {
  @IsString()
  id: string;

  @IsString()
  nama: string;

  @IsArray()
  kehadiran: KehadiranItemDto[];
}

export class CreateLembarAbsensiDto {
  @IsNotEmpty()
  @IsDate()
  dari_tgl: Date;

  @IsNotEmpty()
  @IsDate()
  sampai_tgl: Date;

  @IsOptional()
  kehadiran?: KehadiranDto[];
}
