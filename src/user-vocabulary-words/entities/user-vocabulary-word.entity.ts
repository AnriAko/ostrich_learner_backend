import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserVocabulary } from '../../user-vocabulary/entities/user-vocabulary.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserVocabularyWord {
    @ApiProperty({ example: 1, description: 'Unique identifier of the word' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        type: () => UserVocabulary,
        description: 'User vocabulary this word belongs to',
    })
    @ManyToOne(() => UserVocabulary, (vocabulary) => vocabulary.words, {
        eager: true,
    })
    @JoinColumn({ name: 'vocabularyID' })
    vocabulary: UserVocabulary;

    @ApiProperty({ example: 'apple', description: 'The word being learned' })
    @Column()
    word: string;

    @ApiProperty({ example: 'ვაშლი', description: 'Translation of the word' })
    @Column()
    translate: string;

    @ApiProperty({
        example: '2025-04-15T00:00:00.000Z',
        description: 'Date when the word should be repeated again',
        required: false,
        nullable: true,
    })
    @Column({ type: 'timestamp', nullable: true })
    dateForRepetition: Date | null;

    @ApiProperty({
        example: 0,
        description:
            'Memory score that determines the repetition interval (0–11)',
    })
    @Column({ default: 0 })
    memoryScore: number;

    @ApiProperty({
        example: '2025-04-14T00:00:00.000Z',
        description: 'Date when the word was first learned',
        required: false,
        nullable: true,
    })
    @Column({ type: 'timestamp', nullable: true })
    learningDate: Date | null;
}
