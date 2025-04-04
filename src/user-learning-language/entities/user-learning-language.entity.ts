import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/language/entities/language.entity';
import { UserVocabulary } from 'src/user-vocabulary/entities/user-vocabulary.entity';

@Entity()
export class UserLearningLanguage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    goalCount: number;

    @ManyToOne(() => User, (user) => user.UserLearningLanguage)
    user: User;

    @ManyToOne(() => Language, (language) => language.learners)
    language: Language;

    @OneToMany(() => UserVocabulary, (vocab) => vocab.learningLanguage)
    vocabularies: UserVocabulary[];
}
