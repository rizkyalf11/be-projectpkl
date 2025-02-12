import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AbsensiService } from './absensi.service';
import { CreateLembarAbsensiDto } from './dto/absensi.dto';
import { LembarAbsensi } from './schema/absensi.schema';
import { JwtGuard } from 'src/auth/auth.guard';

@Controller('absensi')
export class AbsensiController {
  constructor(private readonly lembarAbsensiService: AbsensiService) {}

  @UseGuards(JwtGuard)
  @Post('/create')
  async create(
    @Body() createLembarAbsensiDto: CreateLembarAbsensiDto,
  ): Promise<LembarAbsensi> {
    return this.lembarAbsensiService.createLembarAbsensi(
      createLembarAbsensiDto,
    );
  }

  @UseGuards(JwtGuard)
  @Put(':id/kehadiran')
  async updateKehadiran(
    @Param('id') absensiId: string,
    @Body() body: { tanggal: string },
    @Req() req,
  ) {
    const { id: userId } = req.user;
    return this.lembarAbsensiService.updateKehadiran(
      absensiId,
      userId,
      body.tanggal,
    );
  }

  @Get()
  async getAll(): Promise<LembarAbsensi[]> {
    return this.lembarAbsensiService.getAllLembarAbsensi();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<LembarAbsensi> {
    return this.lembarAbsensiService.getLembarAbsensi(id);
  }
}
