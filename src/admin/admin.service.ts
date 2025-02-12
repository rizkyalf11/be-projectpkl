import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';
import BaseResponse from 'src/utils/response/base.response';
import { hash } from 'bcrypt';
import { ResponseSuccess } from 'src/interface/response';
import { CreateAdminDto } from './dto/admin.dto';
import { User } from 'src/users/schema/users.schemas';

@Injectable()
export class AdminService extends BaseResponse {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super();
  }

  async create(payload: CreateAdminDto): Promise<ResponseSuccess> {
    const findUser = await this.adminModel.findOne({
      username: payload.username,
    });

    if (findUser) {
      throw new HttpException('Username sudah digunakan', HttpStatus.CONFLICT);
    }

    payload.password = await hash(payload.password, 12);

    const createdCat = new this.adminModel(payload);
    await createdCat.save();

    return this._success('Registrasi Berhasil', createdCat);
  }

  async getAllUsers(): Promise<ResponseSuccess> {
    const users = await this.userModel.find({});

    return this._success('Data Berhasil Ditemukan', users);
  }
}
