import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { LoginAdminDto } from 'src/admin/admin.dto';
import { Admin } from 'src/admin/admin.schema';
import { ResponseSuccess } from 'src/interface/response';
import { LoginUserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/schema/users.schemas';
import BaseResponse from 'src/utils/response/base.response';

interface jwtPayload {
  id: number;
  nama: string;
  email: string;
}

interface jwtPayloadAdmin {
  id: number;
  username: string;
}

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  generateJWT(
    payload: jwtPayload | jwtPayloadAdmin,
    expiresIn: string | number,
    token: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }

  async loginUser(payload: LoginUserDto): Promise<ResponseSuccess> {
    const findUser = await this.userModel.findOne({ email: payload.email });

    if (!findUser) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(payload.password, findUser.password);

    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: findUser.id,
        nama: findUser.name,
        email: findUser.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '30d',
        this.configService.get('JWT_SECRET'),
      );

      return this._success('Login Berhasil', {
        ...findUser.toObject(),
        access_token,
      });
    } else {
      throw new HttpException(
        'Email dan Password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async loginAdmin(payload: LoginAdminDto): Promise<ResponseSuccess> {
    const findUser = await this.adminModel.findOne({
      username: payload.username,
    });

    if (!findUser) {
      throw new HttpException(
        'Admin tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(payload.password, findUser.password);

    if (checkPassword) {
      const jwtPayloadAdmin: jwtPayloadAdmin = {
        id: findUser.id,
        username: findUser.username,
      };

      const access_token = await this.generateJWT(
        jwtPayloadAdmin,
        '30d',
        this.configService.get('JWT_SECRET'),
      );

      return this._success('Login Berhasil', {
        ...findUser.toObject(),
        access_token,
      });
    } else {
      throw new HttpException(
        'Username dan Password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
