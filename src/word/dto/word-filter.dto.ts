// src/words/dto/word-filter.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';

export class WordFilterDto {
    @ApiPropertyOptional({ description: 'User ID for filtering' })
    @IsOptional()
    @IsString()
    userId: string;

    @ApiPropertyOptional({ description: 'Filter by original word (contains)' })
    @IsOptional()
    @IsString()
    origin?: string;

    @ApiPropertyOptional({ description: 'Filter by translation (contains)' })
    @IsOptional()
    @IsString()
    translation?: string;

    @ApiPropertyOptional({
        description: 'Filter by exact memory score',
        example: 3,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    memoryScore?: number;

    @ApiPropertyOptional({
        description: 'Filter learningDate from (inclusive)',
    })
    @IsOptional()
    @IsString()
    learningDateFrom?: string;

    @ApiPropertyOptional({ description: 'Filter learningDate to (inclusive)' })
    @IsOptional()
    @IsString()
    learningDateTo?: string;

    @ApiPropertyOptional({
        description: 'Filter dateForRepetition from (inclusive)',
    })
    @IsOptional()
    @IsString()
    dateForRepetitionFrom?: string;

    @ApiPropertyOptional({
        description: 'Filter dateForRepetition to (inclusive)',
    })
    @IsOptional()
    @IsString()
    dateForRepetitionTo?: string;

    @ApiPropertyOptional({
        description: 'Filter by vocabulary ID',
        example: 'abc123',
    })
    @IsOptional()
    @IsString()
    vocabularyId?: string;

    @ApiPropertyOptional({
        description: 'Combined search in origin or translation (contains)',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number;

    @ApiPropertyOptional({
        description: 'Page size (10–50)',
        minimum: 10,
        maximum: 50,
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(10)
    @Max(50)
    pageSize?: number;

    @ApiPropertyOptional({
        description: 'Field to sort by',
        enum: [
            'id',
            'origin',
            'translation',
            'memoryScore',
            'learningDate',
            'dateForRepetition',
            'vocabularyId',
        ],
        default: 'id',
    })
    @IsOptional()
    @IsEnum([
        'id',
        'origin',
        'translation',
        'memoryScore',
        'learningDate',
        'dateForRepetition',
        'vocabularyId',
    ] as const)
    sortBy?:
        | 'id'
        | 'origin'
        | 'translation'
        | 'memoryScore'
        | 'learningDate'
        | 'dateForRepetition'
        | 'vocabularyId';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        default: 'ASC',
    })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'] as const)
    sortOrder?: 'ASC' | 'DESC';
}
