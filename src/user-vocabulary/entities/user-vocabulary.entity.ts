import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Language } from 'src/language/entities/language.entity';
import { UserLearningLanguage } from 'src/user-learning-language/entities/user-learning-language.entity';
import { Word } from 'src/word/entities/word.entity';

@Entity()
export class UserVocabulary {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Language, (lang) => lang.vocabulariesFrom)
    sourceLanguage: Language;

    @ManyToOne(() => Language, (lang) => lang.vocabulariesTo)
    targetLanguage: Language;

    @ManyToOne(() => UserLearningLanguage, (ll) => ll.vocabularies)
    learningLanguage: UserLearningLanguage;

    @OneToMany(() => Word, (word) => word.vocabulary)
    words: Word[];
}
