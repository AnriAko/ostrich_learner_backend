import { IsString, IsUUID } from 'class-validator';

export class CreateUserVocabularyDto {
    @IsUUID()
    userId: string;

    @IsString()
    sourceLanguageId: string;

    @IsString()
    targetLanguageId: string;

    @IsString()
    color: string;
}
