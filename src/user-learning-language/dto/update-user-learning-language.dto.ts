import { PartialType } from '@nestjs/mapped-types';
import { CreateUserLearningLanguageDto } from './create-user-learning-language.dto';

export class UpdateUserLearningLanguageDto extends PartialType(CreateUserLearningLanguageDto) {}
