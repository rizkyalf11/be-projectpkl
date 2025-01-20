import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

export default class MongoDBConfig {
  static getMongoDBConfig(configService: ConfigService): MongooseModuleOptions {
    return {
      uri: configService.get('MONGODB'),
    };
  }
}

export const MongoDBConfigAsync: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configservice: ConfigService,
  ): Promise<MongooseModuleOptions> =>
    MongoDBConfig.getMongoDBConfig(configservice),
  inject: [ConfigService],
};
