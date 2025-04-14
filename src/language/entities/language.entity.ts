import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Language {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    flag: string;
}
