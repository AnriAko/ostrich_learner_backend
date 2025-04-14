import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserVocabularyWord } from './entities/user-vocabulary-word.entity';
import { CreateUserVocabularyWordDto } from './dto/create-user-vocabulary-word.dto';
import { UpdateUserVocabularyWordDto } from './dto/update-user-vocabulary-word.dto';

@Injectable()
export class UserVocabularyWordService {
    constructor(
        @InjectRepository(UserVocabularyWord)
        private readonly wordRepo: Repository<UserVocabularyWord>
    ) {}

    private getNextRepetitionDate(score: number): Date {
        const today = new Date();
        const addDays = [0, 1, 3, 5, 7, 10, 14, 28, 42, 56, 70][score] || 0;
        const nextDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + addDays
        );
        return nextDate;
    }

    async create(
        vocabularyId: number,
        dto: CreateUserVocabularyWordDto
    ): Promise<UserVocabularyWord> {
        const exists = await this.wordRepo.findOne({
            where: {
                vocabulary: { id: vocabularyId },
                word: dto.word,
                translate: dto.translate,
            },
        });
        if (exists) {
            throw new Error(
                'Word with this translation already exists in vocabulary'
            );
        }

        const word = this.wordRepo.create({
            ...dto,
            vocabulary: { id: vocabularyId } as any,
        });

        return this.wordRepo.save(word);
    }

    async findAll(): Promise<UserVocabularyWord[]> {
        return this.wordRepo.find();
    }

    async findOne(id: number): Promise<UserVocabularyWord> {
        const word = await this.wordRepo.findOne({ where: { id } });
        if (!word) throw new NotFoundException();
        return word;
    }

    async update(
        id: number,
        dto: UpdateUserVocabularyWordDto
    ): Promise<UserVocabularyWord> {
        const word = await this.findOne(id);
        Object.assign(word, dto);
        return this.wordRepo.save(word);
    }

    async remove(id: number): Promise<void> {
        const word = await this.findOne(id);
        await this.wordRepo.remove(word);
    }

    async testAnswer(
        id: number,
        answer: string
    ): Promise<{ correct: boolean; updated: UserVocabularyWord }> {
        const word = await this.findOne(id);

        const correct =
            word.translate.toLowerCase().trim() === answer.toLowerCase().trim();

        word.memoryScore = Math.max(
            0,
            Math.min(10, word.memoryScore + (correct ? 1 : -1))
        );
        word.dateForRepetition = this.getNextRepetitionDate(word.memoryScore);

        const updated = await this.wordRepo.save(word);
        return { correct, updated };
    }
}
