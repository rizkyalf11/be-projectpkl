import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/schema/users.schemas';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://akunikky11:EV4he5UzAXT5EptR@cluster0.kcviq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
