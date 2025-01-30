import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schemas';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/users.dto';
import { hash } from 'bcrypt';
import { ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';

@Injectable()
export class UsersService extends BaseResponse {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super();
  }

  async create(payload: CreateUserDto): Promise<ResponseSuccess> {
    const findUser = await this.userModel.findOne({
      email: payload.email,
    });

    if (findUser) {
      throw new HttpException('Email sudah digunakan', HttpStatus.CONFLICT);
    }

    payload.password = await hash(payload.password, 12);

    const createdCat = new this.userModel(payload);
    await createdCat.save();

    return this._success('Registrasi Berhasil!', createdCat);
  }
}
