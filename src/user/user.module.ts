import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserConfigModule } from 'src/user-config/user-config.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), UserConfigModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
