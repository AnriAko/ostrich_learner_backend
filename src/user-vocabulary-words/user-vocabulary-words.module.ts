import { Module } from '@nestjs/common';
import { UserVocabularyWordsService } from './user-vocabulary-words.service';
import { UserVocabularyWordsController } from './user-vocabulary-words.controller';

@Module({
  controllers: [UserVocabularyWordsController],
  providers: [UserVocabularyWordsService],
})
export class UserVocabularyWordsModule {}
