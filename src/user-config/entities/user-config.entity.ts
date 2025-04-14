import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InterfaceLanguage } from '../enums/interface-language.enum';
import { Theme } from '../enums/theme.enum';

@Entity()
export class UserConfig {
    @PrimaryColumn()
    userId: string;

    @Column({
        type: 'enum',
        enum: InterfaceLanguage,
        default: InterfaceLanguage.English,
    })
    interfaceLanguage: InterfaceLanguage;

    @Column({
        type: 'enum',
        enum: Theme,
        default: Theme.Light,
    })
    theme: Theme;

    @Column()
    nickname: string;

    @OneToOne(() => User, (user) => user.config, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
