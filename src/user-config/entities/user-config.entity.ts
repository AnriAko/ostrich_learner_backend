import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InterfaceLanguage } from '../enums/interface-language.enum';
import { Theme } from '../enums/theme.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserConfig {
    @PrimaryColumn()
    @ApiProperty({
        description: 'The ID of the user associated with this config.',
    })
    userId: string;

    @Column({
        type: 'enum',
        enum: InterfaceLanguage,
        default: InterfaceLanguage.English,
    })
    @ApiProperty({
        description: 'The language preference for the user interface.',
        enum: InterfaceLanguage,
        default: InterfaceLanguage.English,
    })
    interfaceLanguage: InterfaceLanguage;

    @Column({
        type: 'enum',
        enum: Theme,
        default: Theme.Light,
    })
    @ApiProperty({
        description: 'The theme preference for the user.',
        enum: Theme,
        default: Theme.Light,
    })
    theme: Theme;

    @Column()
    @ApiProperty({
        description: 'The nickname of the user.',
        example: 'JohnDoe',
    })
    nickname: string;

    @OneToOne(() => User, (user) => user.config, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    @ApiProperty({ description: 'The associated user entity.' })
    user: User;
}
