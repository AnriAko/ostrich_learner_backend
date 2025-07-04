import { CreateWordDto } from 'src/word/dto/create-word.dto';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddTranslationDto {
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

    @ApiProperty({ description: 'Data for creating the word' })
    @ValidateNested()
    @Type(() => CreateWordDto)
    createWordDto: CreateWordDto;
}
