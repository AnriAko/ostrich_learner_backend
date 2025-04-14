import { PartialType } from '@nestjs/mapped-types';
import { CreateUserVocabularyWordDto } from './create-user-vocabulary-word.dto';

export class UpdateUserVocabularyWordDto extends PartialType(
    CreateUserVocabularyWordDto
) {}
