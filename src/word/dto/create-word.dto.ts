import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWordDto {
    @ApiProperty({ example: 'apple' })
    @IsString()
    @IsNotEmpty()
    origin: string;

    @ApiProperty({ example: 'ვაშლი' })
    @IsString()
    @IsNotEmpty()
    translation: string;

    @ApiProperty({ example: 'en', description: 'ID of source language' })
    @IsString()
    @IsNotEmpty()
    sourceLang: string;

    @ApiProperty({ example: 'ka', description: 'ID of target language' })
    @IsString()
    @IsNotEmpty()
    targetLang: string;

    @ApiProperty({
        example: 'c1e66c7e-0d9d-4c91-aafb-349d2e3b12c1',
        description: 'User ID',
    })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
