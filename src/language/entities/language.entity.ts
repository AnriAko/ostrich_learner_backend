import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Language {
    @ApiProperty({
        example: 'en',
        description: 'Unique identifier for the language (ISO code).',
    })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ example: 'English', description: 'Name of the language.' })
    @Column()
    name: string;

    @ApiProperty({
        example: '\uD83C\uDDEC\uD83C\uDDE7',
        description: 'Emoji flag representing the language.',
    })
    @Column()
    flag: string;
}
