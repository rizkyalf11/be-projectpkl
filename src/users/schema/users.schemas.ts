import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  IT = 'IT (P3)',
  FIN_ACCT = 'FIN & ACCT (P3)',
  EHS = 'EHS',
  PROCUREMENT_CHAIN_IC = 'PROCUREMENT CHAIN & IC (P3)',
  MARKETING = 'MARKETING (C P3)',
  QUALITY_CONTROL = 'QUALITY CONTROL (P3)',
  MAINTENANCE_CHAIN_IC = 'MAINTENANCE CHAIN & IC (P3)',
}

export enum Gender {
  PRIA = 'pria',
  WANITA = 'wanita',
}

export enum Status {
  PKL = 'PKL',
  MAGANG = 'Magang',
}

@Schema()
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: Status, required: true })
  status: Status;

  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;
}

export const UserSchema = SchemaFactory.createForClass(User);
