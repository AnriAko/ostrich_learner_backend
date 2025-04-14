import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserVocabulary } from './entities/user-vocabulary.entity';
import { CreateUserVocabularyDto } from './dto/create-user-vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user-vocabulary.dto';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/language/entities/language.entity';

@Injectable()
export class UserVocabularyService {
    constructor(
        @InjectRepository(UserVocabulary)
        private readonly userVocabularyRepository: Repository<UserVocabulary>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Language)
        private readonly languageRepository: Repository<Language>
    ) {}

    async createForUser(
        userId: string,
        dto: CreateUserVocabularyDto
    ): Promise<UserVocabulary> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const sourceLanguage = await this.languageRepository.findOne({
            where: { id: dto.sourceLanguageId },
        });
        const targetLanguage = await this.languageRepository.findOne({
            where: { id: dto.targetLanguageId },
        });

        if (!user || !sourceLanguage || !targetLanguage) {
            throw new NotFoundException('User or languages not found');
        }

        const vocabulary = this.userVocabularyRepository.create({
            user,
            sourceLanguage,
            targetLanguage,
            color: dto.color,
        });

        return this.userVocabularyRepository.save(vocabulary);
    }

    async findAll(): Promise<UserVocabulary[]> {
        return this.userVocabularyRepository.find({
            relations: ['user', 'sourceLanguage', 'targetLanguage'],
        });
    }

    async findOne(id: number): Promise<UserVocabulary> {
        const vocabulary = await this.userVocabularyRepository.findOne({
            where: { id },
            relations: ['user', 'sourceLanguage', 'targetLanguage'],
        });

        if (!vocabulary) {
            throw new NotFoundException(
                `UserVocabulary with id ${id} not found`
            );
        }

        return vocabulary;
    }

    async update(
        id: number,
        dto: UpdateUserVocabularyDto
    ): Promise<UserVocabulary> {
        await this.userVocabularyRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.userVocabularyRepository.delete(id);
    }
}
