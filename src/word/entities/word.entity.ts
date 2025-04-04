import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserVocabulary } from 'src/user-vocabulary/entities/user-vocabulary.entity';

@Entity()
export class Word {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string;

    @Column()
    translate: string;

    @ManyToOne(() => UserVocabulary, (vocab) => vocab.words)
    vocabulary: UserVocabulary;
}
