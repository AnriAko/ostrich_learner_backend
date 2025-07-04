import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTranslationDto {
    @ApiProperty({
        description: 'Index of the page in the book',
        example: 0,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    pageIndex: number;

    @ApiProperty({
        description: 'Position ID in the page translation array',
        example: 2,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    posId: number;

    @ApiProperty({
        description: 'ID of the translation to delete',
        example: 123,
    })
    @IsInt()
    translationId: number;
}
