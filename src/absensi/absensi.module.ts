import { Module } from '@nestjs/common';
import { AbsensiService } from './absensi.service';
import { AbsensiController } from './absensi.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LembarAbsensi, LembarAbsensiSchema } from './schema/absensi.schema';
import { User, UserSchema } from 'src/users/schema/users.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LembarAbsensi.name, schema: LembarAbsensiSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AbsensiService],
  controllers: [AbsensiController],
})
export class AbsensiModule {}
