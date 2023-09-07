import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { get } from 'env-var';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor() {}
  createMongooseOptions(): MongooseModuleOptions {
    const dbUserName = get('DB_USERNAME').asString();
    const dbPassword = get('DB_PASSWORD').asString();
    const dbName = get('DB_NAME').asString();
    const dbHost = get('DB_HOST').asString() || 'localhost';
    const dbPort = get('DB_PORT').asString();

    // const uri = `mongodb://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}`;
    const uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
    console.log(uri);
    return {
      uri: uri,
      dbName: dbName,
    };
  }
}
