import { Injectable } from '@nestjs/common';
import BaseResponse from './utils/response/base.response';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users/schema/users.schemas';
import { Model } from 'mongoose';
import { ResponseSuccess } from './interface/response';

@Injectable()
export class AppService extends BaseResponse {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super();
  }

  async getAllUsers(): Promise<ResponseSuccess> {
    const users = await this.userModel.find();

    return this._success('Data berhasil ditemukan!', users);
  }
}
