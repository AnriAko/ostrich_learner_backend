import { Module } from '@nestjs/common';
import { UserLearningLanguageService } from './user-learning-language.service';
import { UserLearningLanguageController } from './user-learning-language.controller';

@Module({
  controllers: [UserLearningLanguageController],
  providers: [UserLearningLanguageService],
})
export class UserLearningLanguageModule {}
