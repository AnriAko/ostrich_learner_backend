import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoClient } from 'mongodb';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            isGlobal: true,
        }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get('DB_USER'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_NAME'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: config.get('MYSQL_SYNC') === 'true',
            }),
        }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            name: 'mongo',
            useFactory: (config: ConfigService) => ({
                type: 'mongodb',
                url: config.get('MONGO_URI'),
                database: config.get('MONGO_DB'),
                entities: [__dirname + '/../**/*.mongo-entity{.ts,.js}'],
                synchronize: config.get('MONGO_SYNC') === 'true',
            }),
        }),
    ],
    providers: [
        {
            provide: MongoClient,
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const client = new MongoClient(config.get('MONGO_URI')!);
                await client.connect();
                return client;
            },
        },
        {
            provide: 'MONGO_URI',
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                config.get<string>('MONGO_URI'),
        },
    ],
    exports: [MongoClient, 'MONGO_URI'],
})
export class DatabaseModule {}
