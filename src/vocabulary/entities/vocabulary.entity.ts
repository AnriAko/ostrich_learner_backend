// src/vocabulary/entities/vocabulary.entity.ts
import {
    Entity,
    ManyToOne,
    OneToMany,
    Unique,
    PrimaryColumn,
    Column,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Language } from 'src/language/entities/language.entity';
import { Word } from 'src/word/entities/word.entity';

@Entity()
@Unique(['user', 'sourceLanguage', 'targetLanguage'])
export class Vocabulary {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, (user) => user.vocabularies, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Language)
    sourceLanguage: Language;

    @ManyToOne(() => Language)
    targetLanguage: Language;

    @OneToMany(() => Word, (word) => word.vocabulary)
    words: Word[];
}
