import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LembarAbsensi, LembarAbsensiDocument } from './schema/absensi.schema';
import { Model, Types } from 'mongoose';
import { CreateLembarAbsensiDto } from './dto/absensi.dto';
import { User, UserDocument } from 'src/users/schema/users.schemas';
import { addDays, format } from 'date-fns';

@Injectable()
export class AbsensiService {
  constructor(
    @InjectModel(LembarAbsensi.name)
    private lembarAbsensiModel: Model<LembarAbsensiDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createLembarAbsensi(
    createLembarAbsensiDto: CreateLembarAbsensiDto,
  ): Promise<LembarAbsensi> {
    const { dari_tgl, sampai_tgl } = createLembarAbsensiDto;

    const users = await this.userModel.find().exec();
    if (!users.length) {
      throw new NotFoundException('Tidak ada pengguna yang ditemukan.');
    }

    const kehadiran = users.map((user) => ({
      id: user._id.toString(),
      nama: user.name,
      kehadiran: [],
    }));

    // **Simpan ke database**
    const lembarAbsensi = new this.lembarAbsensiModel({
      dari_tgl,
      sampai_tgl,
      kehadiran,
    });

    return await lembarAbsensi.save();
  }

  async updateKehadiran(
    absensiId: string,
    userId: string,
    tanggal: string,
  ): Promise<LembarAbsensi> {
    // Konversi tanggal ke number untuk perbandingan
    const tanggalSekarang = parseInt(tanggal, 10);
    console.log('tgl skrng', tanggalSekarang);

    // Cari absensi berdasarkan ID
    const lembarAbsensi = await this.lembarAbsensiModel.findById(absensiId);
    if (!lembarAbsensi) {
      throw new NotFoundException('Lembar absensi tidak ditemukan');
    }

    // Cari user di dalam array kehadiran
    const userObjectId = new Types.ObjectId(userId);
    const userKehadiran = lembarAbsensi.kehadiran.find((k) =>
      new Types.ObjectId(k.id).equals(userObjectId),
    );
    if (!userKehadiran) {
      throw new NotFoundException('User tidak ditemukan dalam absensi');
    }

    // Loop dari awal periode sampai tanggal yang diklik
    for (let tgl = 10; tgl <= tanggalSekarang; tgl++) {
      const tglStr = tgl.toString();
      const tglLengkap = format(
        addDays(new Date(lembarAbsensi.dari_tgl), tgl - 10),
        'yyyy-MM-dd',
      );

      const sudahAda = userKehadiran.kehadiran.find((k) => k.tgl === tglStr);

      if (!sudahAda) {
        userKehadiran.kehadiran.push({
          tgl: tglStr,
          status: 'A',
          tgl_lengkap: tglLengkap,
        });
      }
    }

    // Update status ke "H" untuk tanggal yang diklik
    const dataHariIni = userKehadiran.kehadiran.find((k) => k.tgl === tanggal);
    const tglLengkapHariIni = format(
      addDays(new Date(lembarAbsensi.dari_tgl), tanggalSekarang - 10),
      'yyyy-MM-dd',
    );

    if (dataHariIni) {
      dataHariIni.status = 'H';
    } else {
      userKehadiran.kehadiran.push({
        tgl: tanggal,
        status: 'H',
        tgl_lengkap: tglLengkapHariIni,
      });
    }

    await lembarAbsensi.save();
    return lembarAbsensi;
  }

  async getAllLembarAbsensi(): Promise<LembarAbsensi[]> {
    return await this.lembarAbsensiModel.find().exec();
  }

  async getLembarAbsensi(id: string): Promise<LembarAbsensi> {
    const lembarAbsensi = await this.lembarAbsensiModel.findById(id);
    if (!lembarAbsensi) {
      throw new NotFoundException('Lembar absensi tidak ditemukan');
    }

    return await lembarAbsensi;
  }
}
