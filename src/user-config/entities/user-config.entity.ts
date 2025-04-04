import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class UserConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    interfaceLanguage: string;

    @Column()
    theme: string;

    @OneToOne(() => User, (user) => user.config)
    user: User;
}
