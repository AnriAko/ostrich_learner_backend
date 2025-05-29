import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Vocabulary } from '../../vocabulary/entities/vocabulary.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Word {
    @ApiProperty({ example: 1, description: 'Unique identifier of the word' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        type: () => Vocabulary,
        description: 'User vocabulary this word belongs to',
    })
    @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.words, {
        eager: true,
    })
    @JoinColumn({ name: 'vocabularyID' })
    vocabulary: Vocabulary;

    @ApiProperty({ example: 'apple', description: 'The word being learned' })
    @Column()
    origin: string;

    @ApiProperty({ example: 'ვაშლი', description: 'Translation of the word' })
    @Column()
    translation: string;

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

    @ApiProperty({
        example: '2025-05-29T12:00:00.000Z',
        description: 'Date when the word was created',
    })
    @CreateDateColumn({ type: 'timestamp' })
    creationDate: Date;
}
