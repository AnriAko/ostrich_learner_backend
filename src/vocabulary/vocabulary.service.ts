import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-vocabulary.dto';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/language/entities/language.entity';

@Injectable()
export class VocabularyService {
    constructor(
        @InjectRepository(Vocabulary)
        private readonly userVocabularyRepository: Repository<Vocabulary>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Language)
        private readonly languageRepository: Repository<Language>
    ) {}

    async createVocabulary(dto: CreateVocabularyDto): Promise<Vocabulary> {
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
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

        const vocabularyId = `${user.id}-${sourceLanguage.id}-${targetLanguage.id}`;
        const vocabularyName = `${sourceLanguage.id}-${targetLanguage.id}`;

        const existing = await this.userVocabularyRepository.findOne({
            where: { id: vocabularyId, user: { id: user.id } },
        });

        if (existing) {
            return existing;
        }

        const vocabulary = this.userVocabularyRepository.create({
            id: vocabularyId,
            name: vocabularyName,
            user,
            sourceLanguage,
            targetLanguage,
        });

        return this.userVocabularyRepository.save(vocabulary);
    }

    async findAllByUser(userId: string): Promise<Vocabulary[]> {
        return this.userVocabularyRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'sourceLanguage', 'targetLanguage'],
        });
    }

    async findOne(id: string): Promise<Vocabulary> {
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
        id: string,
        dto: UpdateUserVocabularyDto
    ): Promise<Vocabulary> {
        const entity = await this.userVocabularyRepository.preload({
            id,
            ...dto,
        });
        if (!entity) {
            throw new NotFoundException(`Vocabulary with ID ${id} not found`);
        }
        return this.userVocabularyRepository.save(entity);
    }

    async remove(id: string): Promise<void> {
        await this.userVocabularyRepository.delete(id);
    }
}
