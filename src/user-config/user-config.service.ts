import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConfig } from './entities/user-config.entity';
import { InterfaceLanguage } from './enums/interface-language.enum';
import { Theme } from './enums/theme.enum';

@Injectable()
export class UserConfigService {
    constructor(
        @InjectRepository(UserConfig)
        private readonly userConfigRepository: Repository<UserConfig>
    ) {}

    async findOne(userId: string): Promise<UserConfig> {
        const config = await this.userConfigRepository.findOne({
            where: { userId },
        });
        if (!config) throw new NotFoundException('UserConfig not found');
        return config;
    }

    async updateLanguage(
        userId: string,
        language: InterfaceLanguage
    ): Promise<UserConfig> {
        const config = await this.findOne(userId);
        config.interfaceLanguage = language;
        return this.userConfigRepository.save(config);
    }

    async updateTheme(userId: string, theme: Theme): Promise<UserConfig> {
        const config = await this.findOne(userId);
        config.theme = theme;
        return this.userConfigRepository.save(config);
    }

    async updateNickname(
        userId: string,
        nickname: string
    ): Promise<UserConfig> {
        const config = await this.findOne(userId);
        config.nickname = nickname;
        return this.userConfigRepository.save(config);
    }

    async createDefaultConfig(
        userId: string,
        nickname: string
    ): Promise<UserConfig> {
        const config = this.userConfigRepository.create({ userId, nickname });
        return this.userConfigRepository.save(config);
    }
}
