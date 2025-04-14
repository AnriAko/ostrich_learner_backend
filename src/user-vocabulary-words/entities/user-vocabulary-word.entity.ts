import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserVocabulary } from '../../user-vocabulary/entities/user-vocabulary.entity';

@Entity()
export class UserVocabularyWord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserVocabulary, (vocabulary) => vocabulary.words, {
        eager: true,
    })
    @JoinColumn({ name: 'vocabularyID' })
    vocabulary: UserVocabulary;

    @Column()
    word: string;

    @Column()
    translate: string;

    @Column()
    dateForRepetition: Date;

    @Column({ default: 0 })
    memoryScore: number;

    @CreateDateColumn()
    creationDate: Date;

    @BeforeInsert()
    setInitialValues() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.dateForRepetition = new Date(
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate()
        );
    }
}
