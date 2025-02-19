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
  kehadiran_user_detail: KehadiranItem[];
};

@Schema({ timestamps: true })
export class LembarAbsensi {
  @Prop({ type: Date, required: true })
  dari_tgl: Date;

  @Prop({ type: Date, required: true })
  sampai_tgl: Date;

  @Prop({ type: Array, required: true })
  tgl_list: string[];

  @Prop({ type: Array, default: [] })
  tgl_free_list: string[];

  @Prop({
    type: [
      {
        id: Types.ObjectId,
        nama: String,
        kehadiran_user_detail: [
          { tgl: String, status: String, tgl_lengkap: String },
        ],
      },
    ],
    default: [],
  })
  kehadiran_user: Kehadiran[];
}

export const LembarAbsensiSchema = SchemaFactory.createForClass(LembarAbsensi);
