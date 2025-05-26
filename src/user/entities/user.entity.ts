import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { UserConfig } from 'src/user-config/entities/user-config.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({ unique: true })
    // email: string;

    // @Column()
    // password: string;

    @OneToOne(() => UserConfig, (config) => config.user)
    config: UserConfig;

    @OneToMany(() => Vocabulary, (v) => v.user)
    vocabularies: Vocabulary[];
}
