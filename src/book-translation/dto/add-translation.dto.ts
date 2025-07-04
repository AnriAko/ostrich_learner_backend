import { CreateWordDto } from 'src/word/dto/create-word.dto';

export class AddTranslationDto {
    pageIndex: number;
    posId: number;
    createWordDto: CreateWordDto;
}
