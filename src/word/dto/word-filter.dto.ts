import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsUUID, IsNumber } from 'class-validator';

export class WordFilterDto {
    @IsUUID()
    userId: string;

    @IsOptional()
    origin?: string;

    @IsOptional()
    translation?: string;

    @IsOptional()
    vocabularyId?: string;

    @IsOptional()
    @IsEnum([
        'origin',
        'translation',
        'memoryScore',
        'learningDate',
        'dateForRepetition',
        'vocabularyId',
        'vocabularyName',
        'creationDate',
    ])
    sortBy?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    pageSize?: number;

    @IsOptional()
    vocabulary?: string;
}
