import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserConfigService } from 'src/user-config/user-config.service';

// Possibly change later
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userConfigService: UserConfigService
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create();
        const savedUser = await this.userRepository.save(user);

        await this.userConfigService.createDefaultConfig(
            savedUser.id,
            createUserDto.nickname
        );

        return savedUser;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    //     const user = await this.findOne(id);
    //     Object.assign(user, updateUserDto);
    //     return this.userRepository.save(user);
    // }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.userRepository.delete(id);
    }
}
