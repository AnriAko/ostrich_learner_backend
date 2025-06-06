import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Word } from './entities/word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { VocabularyService } from 'src/vocabulary/vocabulary.service';
import { User } from 'src/user/entities/user.entity';
import { WordFilterDto } from './dto/word-filter.dto';
import { TestResultDto } from './dto/test-result.dto';

@Injectable()
export class WordService {
    constructor(
        @InjectRepository(Word)
        private readonly wordRepo: Repository<Word>,
        @InjectRepository(Vocabulary)
        private readonly vocabularyRepo: Repository<Vocabulary>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly vocabularyService: VocabularyService
    ) {}

    private stripTime(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    private getNextRepetitionDate(score: number): Date {
        const today = this.stripTime(new Date());
        const addDays = [1, 2, 4, 8, 16, 32, 64, 128, 256][score] || 0;
        today.setDate(today.getDate() + addDays);
        return today;
    }

    async create(dto: CreateWordDto): Promise<Word> {
        const wordLower = dto.origin.toLowerCase().trim();
        const translateLower = dto.translation.toLowerCase().trim();

        if (dto.sourceLang === dto.targetLang) {
            throw new BadRequestException(
                'Source and target languages must be different.'
            );
        }
        const vocabulary = await this.vocabularyService.createVocabulary({
            userId: dto.userId,
            sourceLanguageId: dto.sourceLang,
            targetLanguageId: dto.targetLang,
        });

        const exists = await this.wordRepo.findOne({
            where: {
                vocabulary: { id: vocabulary.id },
                origin: wordLower,
                translation: translateLower,
            },
        });

        if (exists) {
            throw new BadRequestException(
                'Word with this translation already exists in this vocabulary.'
            );
        }

        const user = await this.userRepository.findOneBy({ id: dto.userId });
        if (!user) throw new NotFoundException('User not found');

        const word = this.wordRepo.create({
            origin: wordLower,
            translation: translateLower,
            vocabulary,
            memoryScore: 0,
            learningDate: null,
            dateForRepetition: null,
        });

        return this.wordRepo.save(word);
    }

    async findOne(id: number): Promise<Word> {
        const word = await this.wordRepo.findOne({ where: { id } });
        if (!word) throw new NotFoundException('Word not found');
        return word;
    }

    async update(id: number, dto: UpdateWordDto): Promise<Word> {
        const word = await this.findOne(id);
        if (dto.origin) dto.origin = dto.origin.toLowerCase().trim();
        if (dto.translation)
            dto.translation = dto.translation.toLowerCase().trim();
        Object.assign(word, dto);
        return this.wordRepo.save(word);
    }

    async remove(id: number): Promise<void> {
        const word = await this.findOne(id);
        await this.wordRepo.remove(word);
    }

    async getAvailableForLearning(userId: string): Promise<any[]> {
        const words = await this.wordRepo
            .createQueryBuilder('word')
            .leftJoinAndSelect('word.vocabulary', 'vocabulary')
            .where('vocabulary.user.id = :userId', { userId })
            .andWhere('(word.memoryScore = 0 OR word.learningDate IS NULL)')
            .getMany();

        return words.map((word) => ({
            ...word,
            vocabularyName: word.vocabulary.name,
        }));
    }

    async getAvailableForRepetitionTestWords(userId: string): Promise<any[]> {
        const today = this.stripTime(new Date());

        const words = await this.wordRepo
            .createQueryBuilder('word')
            .leftJoinAndSelect('word.vocabulary', 'vocabulary')
            .where('vocabulary.user.id = :userId', { userId })
            .andWhere('word.memoryScore > 0')
            .andWhere('word.dateForRepetition <= :today', { today })
            .getMany();

        return words.map((word) => ({
            ...word,
            vocabularyName: word.vocabulary.name,
        }));
    }

    async getAllLearnedWordsByMonth(
        vocabularyId: string,
        year: number,
        month: number
    ): Promise<Record<string, Word[]>> {
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

        const grouped: Record<string, Word[]> = {};
        for (const word of words) {
            const day =
                word.learningDate?.toISOString().split('T')[0] ?? 'No date';
            grouped[day] = grouped[day] || [];
            grouped[day].push(word);
        }

        return grouped;
    }

    async findByUser(userId: string, page = 1, pageSize = 20): Promise<Word[]> {
        return this.wordRepo
            .createQueryBuilder('word')
            .innerJoin('word.vocabulary', 'vocabulary')
            .innerJoin('vocabulary.user', 'user')
            .where('user.id = :userId', { userId })
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
    }

    async findByVocabulary(
        vocabularyId: string,
        page = 1,
        pageSize = 20
    ): Promise<Word[]> {
        return this.wordRepo.find({
            where: { vocabulary: { id: vocabularyId } },
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { id: 'ASC' },
        });
    }

    async getLearningStatsByDay(
        userId: string
    ): Promise<{ date: string; count: number }[]> {
        const words = await this.wordRepo
            .createQueryBuilder('word')
            .innerJoin('word.vocabulary', 'vocabulary')
            .innerJoin('vocabulary.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('word.memoryScore > 0')
            .andWhere('word.learningDate IS NOT NULL')
            .getMany();

        const grouped: Record<string, number> = {};
        for (const word of words) {
            const date = word.learningDate?.toISOString().split('T')[0];
            if (date) grouped[date] = (grouped[date] || 0) + 1;
        }

        return Object.entries(grouped).map(([date, count]) => ({
            date,
            count,
        }));
    }

    async findFiltered(userId: string, filterDto: WordFilterDto) {
        const {
            origin,
            translation,
            vocabularyId,
            vocabulary,
            sortBy = 'creationDate',
            sortOrder = 'desc',
            page = 1,
            pageSize = 20,
        } = filterDto;

        const skip = (page - 1) * pageSize;

        const queryBuilder = this.wordRepo
            .createQueryBuilder('word')
            .innerJoinAndSelect('word.vocabulary', 'vocabulary')
            .innerJoin('vocabulary.user', 'user')
            .where('user.id = :userId', { userId });

        if (origin) {
            queryBuilder.andWhere('LOWER(word.origin) LIKE :origin', {
                origin: `%${origin.toLowerCase()}%`,
            });
        }

        if (translation) {
            queryBuilder.andWhere('LOWER(word.translation) LIKE :translation', {
                translation: `%${translation.toLowerCase()}%`,
            });
        }

        if (vocabularyId) {
            queryBuilder.andWhere('vocabulary.id = :vocabularyId', {
                vocabularyId,
            });
        }

        if (vocabulary) {
            queryBuilder.andWhere('LOWER(vocabulary.name) LIKE :vocabulary', {
                vocabulary: `%${vocabulary.toLowerCase()}%`,
            });
        }

        const orderField =
            sortBy === 'vocabulary' || sortBy === 'vocabularyName'
                ? 'vocabulary.name'
                : `word.${sortBy}`;

        queryBuilder
            .orderBy(orderField, sortOrder.toUpperCase() as 'ASC' | 'DESC')
            .skip(skip)
            .take(pageSize);

        const [words, total] = await queryBuilder.getManyAndCount();

        const items = words.map((word) => ({
            ...word,
            vocabularyName: word.vocabulary.name,
        }));

        return { items, total };
    }
    async checkAnswer(
        id: number,
        origin: string,
        translation: string,
        userId: string
    ): Promise<'directMatch' | 'userHasThisTranslation' | 'noMatch'> {
        const normalizedTranslation = translation.toLowerCase().trim();
        const normalizedOrigin = origin.toLowerCase().trim();

        const word = await this.wordRepo.findOne({
            where: {
                id: id,
                origin: normalizedOrigin,
                translation: normalizedTranslation,
            },
        });

        if (word) {
            return 'directMatch';
        }

        const userTranslation = await this.wordRepo
            .createQueryBuilder('word')
            .innerJoin('word.vocabulary', 'vocabulary')
            .innerJoin('vocabulary.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('LOWER(TRIM(word.origin)) = :origin', {
                origin: normalizedOrigin,
            })
            .andWhere('LOWER(TRIM(word.translation)) = :translation', {
                translation: normalizedTranslation,
            })
            .getOne();

        if (userTranslation) {
            return 'userHasThisTranslation';
        }

        return 'noMatch';
    }
    async processTestResults(results: TestResultDto[]): Promise<void> {
        const ids = results.map((r) => r.id);
        const words = await this.wordRepo.findByIds(ids);

        if (words.length !== ids.length) {
            throw new NotFoundException('Some words were not found');
        }

        const today = this.stripTime(new Date());
        const resultsMap = new Map<number, boolean>();
        results.forEach((r) => resultsMap.set(r.id, r.isMistaken));

        for (const word of words) {
            const isMistaken = resultsMap.get(word.id);
            if (isMistaken === undefined) continue;
            if (word.dateForRepetition && word.dateForRepetition > today) {
                continue;
            }
            if (word.memoryScore === 0) {
                word.memoryScore = 1;
                word.dateForRepetition = this.getNextRepetitionDate(1);
                word.learningDate = today;
                continue;
            }
            if (!isMistaken) {
                word.memoryScore = Math.min(word.memoryScore + 1, 10);
            } else {
                if (word.memoryScore > 1) {
                    word.memoryScore = 1;
                }
            }
            if (word.memoryScore >= 10) {
                word.dateForRepetition = null;
            } else {
                word.dateForRepetition = this.getNextRepetitionDate(
                    word.memoryScore
                );
            }
        }
        await this.wordRepo.save(words);
    }
}
