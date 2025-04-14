import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserVocabulary } from './entities/user-vocabulary.entity';
import { CreateUserVocabularyDto } from './dto/create-user-vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user-vocabulary.dto';

@Injectable()
export class UserVocabularyService {
    constructor(
        @InjectRepository(UserVocabulary)
        private readonly userVocabularyRepository: Repository<UserVocabulary>
    ) {}

    async create(dto: CreateUserVocabularyDto): Promise<UserVocabulary> {
        const vocabulary = this.userVocabularyRepository.create(dto);
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
