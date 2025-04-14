import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/language/entities/language.entity';
import { UserVocabularyWord } from 'src/user-vocabulary-words/entities/user-vocabulary-word.entity';

@Entity()
@Unique(['user', 'sourceLanguage', 'targetLanguage'])
export class UserVocabulary {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.vocabularies, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Language)
    sourceLanguage: Language;

    @ManyToOne(() => Language)
    targetLanguage: Language;

    @Column()
    color: string;

    @OneToMany(() => UserVocabularyWord, (word) => word.vocabulary)
    words: UserVocabularyWord[];
}
