import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LembarAbsensi, LembarAbsensiDocument } from './schema/absensi.schema';
import { Model, Types } from 'mongoose';
import { CreateLembarAbsensiDto } from './dto/absensi.dto';
import { User, UserDocument } from 'src/users/schema/users.schemas';
import { addDays, format, getDate } from 'date-fns';
import BaseResponse from 'src/utils/response/base.response';
import { ResponseSuccess } from 'src/interface/response';

@Injectable()
export class AbsensiService extends BaseResponse {
  constructor(
    @InjectModel(LembarAbsensi.name)
    private lembarAbsensiModel: Model<LembarAbsensiDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async getDataAbsenUser(id: string): Promise<ResponseSuccess> {
    const objectId = new Types.ObjectId(id);
    const result = await this.lembarAbsensiModel.find(
      {
        'kehadiran_user.id': objectId,
      },
      {
        'kehadiran_user.$': 1,
        dari_tgl: 1,
        sampai_tgl: 1,
        tgl_list: 1,
        tgl_free_list: 1,
      },
    );

    return this._success('Berhasil mendapatkan data', result);
  }

  async createLembarAbsensi(
    createLembarAbsensiDto: CreateLembarAbsensiDto,
  ): Promise<LembarAbsensi> {
    const { dari_tgl, sampai_tgl, tgl_free_list } = createLembarAbsensiDto;

    const tgl_list = [];
    for (let tgl = getDate(dari_tgl); tgl <= getDate(sampai_tgl); tgl++) {
      tgl_list.push(tgl.toString());
    }

    const users = await this.userModel.find().exec();
    if (!users.length) {
      throw new NotFoundException('Tidak ada pengguna yang ditemukan.');
    }

    const kehadiran_user = users.map((user) => ({
      id: user._id.toString(),
      nama: user.name,
      kehadiran_user_detail: [],
    }));

    const lembarAbsensi = new this.lembarAbsensiModel({
      dari_tgl,
      sampai_tgl,
      tgl_list,
      tgl_free_list,
      kehadiran_user,
    });

    return await lembarAbsensi.save();
  }

  async getLembarkehadiran(): Promise<ResponseSuccess> {
    const lembarAbsensi = await this.lembarAbsensiModel
      .find()
      .select('-kehadiran')
      .exec();

    return this._success('Berhasil mendapatkan data', lembarAbsensi);
  }

  async updateKehadiran(
    absensiId: string,
    userId: string,
    tanggal: string,
  ): Promise<ResponseSuccess> {
    const lembarAbsensi = await this.lembarAbsensiModel.findById(absensiId);
    if (!lembarAbsensi) {
      throw new NotFoundException('Lembar absensi tidak ditemukan');
    }

    const dariTglLembar = getDate(lembarAbsensi.dari_tgl);
    const sampaiTglLembar = getDate(lembarAbsensi.sampai_tgl);
    const tanggalSekarang = parseInt(tanggal);
    const tglLengkapHariIni = format(
      addDays(
        new Date(lembarAbsensi.dari_tgl),
        tanggalSekarang - dariTglLembar,
      ),
      'yyyy-MM-dd',
    );

    if (tanggalSekarang < dariTglLembar || tanggalSekarang > sampaiTglLembar) {
      throw new BadRequestException(
        `Tanggal ${tglLengkapHariIni} di luar rentang absensi (${format(lembarAbsensi.dari_tgl, 'yyyy-MM-dd')} - ${format(lembarAbsensi.sampai_tgl, 'yyyy-MM-dd')})`,
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const userKehadiran = lembarAbsensi.kehadiran_user.find((k) =>
      new Types.ObjectId(k.id).equals(userObjectId),
    );
    if (!userKehadiran) {
      throw new NotFoundException('User tidak ditemukan dalam absensi');
    }

    for (let tgl = dariTglLembar; tgl <= tanggalSekarang; tgl++) {
      const tglStr = tgl.toString();
      const tglLengkap = format(
        addDays(new Date(lembarAbsensi.dari_tgl), tgl - dariTglLembar),
        'yyyy-MM-dd',
      );

      const sudahAda = userKehadiran.kehadiran_user_detail.find(
        (k) => k.tgl === tglStr,
      );

      if (!sudahAda) {
        const isFree = lembarAbsensi.tgl_free_list.includes(tgl.toString());

        userKehadiran.kehadiran_user_detail.push({
          tgl: tglStr,
          status: isFree ? 'L' : 'A',
          tgl_lengkap: tglLengkap,
        });
      }
    }

    const dataHariIni = userKehadiran.kehadiran_user_detail.find(
      (k) => k.tgl === tanggal,
    );
    console.log('tanggal lengkap hari ini', tglLengkapHariIni);

    if (dataHariIni) {
      dataHariIni.status = 'H';
    } else {
      userKehadiran.kehadiran_user_detail.push({
        tgl: tanggal,
        status: 'H',
        tgl_lengkap: tglLengkapHariIni,
      });
    }

    await lembarAbsensi.save();
    return this._success('Berhasil');
  }

  async getLembarAbsensi(id: string): Promise<LembarAbsensi> {
    const lembarAbsensi = await this.lembarAbsensiModel.findById(id);
    if (!lembarAbsensi) {
      throw new NotFoundException('Lembar absensi tidak ditemukan');
    }

    return await lembarAbsensi;
  }
}
