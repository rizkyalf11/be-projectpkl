import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { ResponseSuccess } from 'src/interface/response';
import { LoginUserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/schema/users.schemas';
import BaseResponse from 'src/utils/response/base.response';

interface jwtPayload {
  id: number;
  nama: string;
  email: string;
}

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
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

      return this._success('Login Berhasil', { ...findUser, access_token });
    } else {
      throw new HttpException(
        'Email dan Password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
