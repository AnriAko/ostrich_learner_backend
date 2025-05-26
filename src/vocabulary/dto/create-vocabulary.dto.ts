import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVocabularyDto {
    @ApiProperty({
        example: 'a96b3b46-fb1e-42d7-bfd4-fc48ebf3a65a',
        description: 'ID of the user who owns the vocabulary',
    })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: 'en',
        description: 'Source language ID (ISO code)',
    })
    @IsString()
    @IsNotEmpty()
    sourceLanguageId: string;

    @ApiProperty({
        example: 'fr',
        description: 'Target language ID (ISO code)',
    })
    @IsString()
    @IsNotEmpty()
    targetLanguageId: string;
}
