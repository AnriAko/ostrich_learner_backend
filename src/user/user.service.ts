import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserConfigService } from 'src/user-config/user-config.service';
import { FullUserProfileDto } from './dto/full-user-profile.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';

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

        await this.userConfigService.createUserConfig(
            savedUser.id,
            createUserDto.nickname,
            createUserDto.theme,
            createUserDto.interfaceLanguage
        );

        return savedUser;
    }

    async findAll(): Promise<{ id: string; nickname: string }[]> {
        const users = await this.userRepository.find({
            relations: ['config'],
        });

        return users.map((user) => ({
            id: user.id,
            nickname: user.config?.nickname || '',
        }));
    }

    async findOne(id: string): Promise<{ id: string; nickname: string }> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['config'],
        });

        if (!user || !user.config)
            throw new NotFoundException('User or user config not found');

        return { id: user.id, nickname: user.config.nickname };
    }

    async updateNickname(
        userId: string,
        dto: UpdateNicknameDto
    ): Promise<{ id: string; nickname: string }> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['config'],
        });

        if (!user || !user.config) {
            throw new NotFoundException('User or user config not found');
        }

        user.config.nickname = dto.nickname;
        await this.userConfigService.updateNickname(userId, dto.nickname);

        return { id: user.id, nickname: user.config.nickname };
    }

    async delete(userId: string): Promise<void> {
        await this.findOne(userId);
        await this.userRepository.delete(userId);
    }
    async getFullProfileById(userId: string): Promise<FullUserProfileDto> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['config'],
        });

        if (!user || !user.config) {
            throw new NotFoundException('User or config not found');
        }

        return {
            id: user.id,
            nickname: user.config.nickname,
            theme: user.config.theme,
            interfaceLanguage: user.config.interfaceLanguage,
        };
    }
}
