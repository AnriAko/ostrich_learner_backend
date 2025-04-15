import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { UserVocabularyWord } from './entities/user-vocabulary-word.entity';
import { CreateUserVocabularyWordDto } from './dto/create-user-vocabulary-word.dto';
import { UpdateUserVocabularyWordDto } from './dto/update-user-vocabulary-word.dto';

@Injectable()
export class UserVocabularyWordService {
    constructor(
        @InjectRepository(UserVocabularyWord)
        private readonly wordRepo: Repository<UserVocabularyWord>
    ) {}

    private stripTime(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    private getNextRepetitionDate(score: number): Date {
        const today = this.stripTime(new Date());
        const addDays =
            [0, 1, 3, 5, 7, 10, 14, 28, 42, 56, 70, 140][score] || 0;
        today.setDate(today.getDate() + addDays);
        return today;
    }

    async create(
        vocabularyId: number,
        dto: CreateUserVocabularyWordDto
    ): Promise<UserVocabularyWord> {
        const wordLower = dto.word.toLowerCase().trim();
        const translateLower = dto.translate.toLowerCase().trim();

        const exists = await this.wordRepo.findOne({
            where: {
                vocabulary: { id: vocabularyId },
                word: wordLower,
                translate: translateLower,
            },
        });

        if (exists) {
            throw new Error(
                'Word with this translation already exists in vocabulary'
            );
        }

        const word = this.wordRepo.create({
            ...dto,
            word: wordLower,
            translate: translateLower,
            vocabulary: { id: vocabularyId } as any,
            dateForRepetition: null, // explicitly null
            memoryScore: 0,
            learningDate: null,
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

        if (dto.word) {
            dto.word = dto.word.toLowerCase().trim();
        }
        if (dto.translate) {
            dto.translate = dto.translate.toLowerCase().trim();
        }

        Object.assign(word, dto);
        return this.wordRepo.save(word);
    }

    async remove(id: number): Promise<void> {
        const word = await this.findOne(id);
        await this.wordRepo.remove(word);
    }

    async getAvailableForTestWords(
        vocabularyId: number
    ): Promise<UserVocabularyWord[]> {
        return this.wordRepo.find({
            where: {
                vocabulary: { id: vocabularyId },
                memoryScore: 0,
            },
        });
    }

    async getAvailableForRepetitionTestWords(
        vocabularyId: number
    ): Promise<UserVocabularyWord[]> {
        const today = this.stripTime(new Date());

        return this.wordRepo.find({
            where: {
                vocabulary: { id: vocabularyId },
                memoryScore: MoreThan(0),
                dateForRepetition: Between(new Date('1970-01-01'), today),
            },
        });
    }

    async testAnswer(
        id: number,
        answer: string
    ): Promise<{ correct: boolean; updated: UserVocabularyWord }> {
        const word = await this.findOne(id);

        const today = this.stripTime(new Date());
        const wordDate = word.dateForRepetition
            ? this.stripTime(new Date(word.dateForRepetition))
            : null;

        if (word.memoryScore > 0 && wordDate && wordDate > today) {
            throw new BadRequestException(
                'This word is not ready for repetition yet.'
            );
        }

        const correct =
            word.translate.toLowerCase().trim() === answer.toLowerCase().trim();

        if (correct) {
            if (word.memoryScore === 0 && !word.learningDate) {
                word.learningDate = today;
            }

            word.memoryScore = Math.min(11, word.memoryScore + 1);
        } else {
            word.memoryScore =
                word.memoryScore > 0 ? Math.max(1, word.memoryScore - 1) : 0;
        }

        word.dateForRepetition = this.getNextRepetitionDate(word.memoryScore);

        const updated = await this.wordRepo.save(word);
        return { correct, updated };
    }

    async getAllLearnedWordsByMonth(
        vocabularyId: number,
        year: number,
        month: number
    ): Promise<Record<string, UserVocabularyWord[]>> {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        const words = await this.wordRepo.find({
            where: {
                vocabulary: { id: vocabularyId },
                learningDate: Between(start, end),
                memoryScore: MoreThan(0),
            },
            order: { learningDate: 'ASC' },
        });

        const grouped: Record<string, UserVocabularyWord[]> = {};

        for (const word of words) {
            const day = word.learningDate
                ? new Date(word.learningDate).toLocaleDateString()
                : 'No date';
            if (!grouped[day]) {
                grouped[day] = [];
            }
            grouped[day].push(word);
        }

        return grouped;
    }
}
