import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { UserConfig } from 'src/user-config/entities/user-config.entity';
import { UserLearningLanguage } from 'src/user-learning-language/entities/user-learning-language.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @OneToOne(() => UserConfig, (config) => config.user, { cascade: true })
    @JoinColumn()
    config: UserConfig;

    @OneToMany(() => UserLearningLanguage, (lang) => lang.user)
    UserLearningLanguage: UserLearningLanguage[];
}
