import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { UserLearningLanguage } from 'src/user-learning-language/entities/user-learning-language.entity';
import { UserVocabulary } from 'src/user-vocabulary/entities/user-vocabulary.entity';

@Entity()
export class Language {
    @PrimaryColumn()
    languageName: string;

    @Column()
    flag: string;

    @OneToMany(
        () => UserLearningLanguage,
        (learningLang) => learningLang.language
    )
    learners: UserLearningLanguage[];

    @OneToMany(() => UserVocabulary, (vocab) => vocab.sourceLanguage)
    vocabulariesFrom: UserVocabulary[];

    @OneToMany(() => UserVocabulary, (vocab) => vocab.targetLanguage)
    vocabulariesTo: UserVocabulary[];
}
