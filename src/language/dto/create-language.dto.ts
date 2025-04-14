import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageDto {
    @ApiProperty({
        example: 'en',
        description: 'Unique identifier for the language (ISO code).',
    })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ example: 'English', description: 'Name of the language.' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '\uD83C\uDDEC\uD83C\uDDE7',
        description: 'Emoji flag representing the language.',
    })
    @IsString()
    @IsNotEmpty()
    flag: string;
}
