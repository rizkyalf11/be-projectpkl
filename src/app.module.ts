import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/schema/users.schemas';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongoDBConfigAsync } from './config/mongodb.config';
import { jwtConfigAsync } from './config/jwt.config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AbsensiModule } from './absensi/absensi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync(jwtConfigAsync),
    MongooseModule.forRootAsync(MongoDBConfigAsync),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    AuthModule,
    AdminModule,
    AbsensiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
