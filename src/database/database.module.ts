import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            isGlobal: true,
        }),

        // MySQL connection (default)
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: configService.get('MYSQL_SYNC') === 'true',
            }),
        }),

        // MongoDB connection (named)
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            name: 'mongo',
            useFactory: (configService: ConfigService) => ({
                type: 'mongodb',
                url: configService.get('MONGO_URI'),
                database: configService.get('MONGO_DB'),
                useNewUrlParser: true,
                useUnifiedTopology: true,
                entities: [__dirname + '/../**/*.mongo-entity{.ts,.js}'],
                synchronize: configService.get('MONGO_SYNC') === 'true',
            }),
        }),
    ],
})
export class DatabaseModule {}
