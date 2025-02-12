import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type LembarAbsensiDocument = HydratedDocument<LembarAbsensi>;

type KehadiranItem = {
  tgl: string;
  status: string;
  tgl_lengkap: string;
};

type Kehadiran = {
  id: Types.ObjectId;
  nama: string;
  kehadiran: KehadiranItem[];
};

@Schema({ timestamps: true })
export class LembarAbsensi {
  @Prop({ type: Date, required: true })
  dari_tgl: Date;

  @Prop({ type: Date, required: true })
  sampai_tgl: Date;

  @Prop({
    type: [
      {
        id: Types.ObjectId,
        nama: String,
        kehadiran: [{ tgl: String, status: String, tgl_lengkap: String }],
      },
    ],
    default: [],
  })
  kehadiran: Kehadiran[];
}

export const LembarAbsensiSchema = SchemaFactory.createForClass(LembarAbsensi);
