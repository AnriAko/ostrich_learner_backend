import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserVocabularyWordDto {
    @ApiProperty({
        example: 'apple',
        description: 'The word to be translated.',
    })
    @IsString()
    @IsNotEmpty()
    word: string;

    @ApiProperty({
        example: 'ვაშლი',
        description: 'The translation of the word.',
    })
    @IsString()
    @IsNotEmpty()
    translate: string;
}
