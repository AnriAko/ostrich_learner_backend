import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabularyWordsController } from './user-vocabulary-words.controller';
import { UserVocabularyWordsService } from './user-vocabulary-words.service';

describe('UserVocabularyWordsController', () => {
  let controller: UserVocabularyWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVocabularyWordsController],
      providers: [UserVocabularyWordsService],
    }).compile();

    controller = module.get<UserVocabularyWordsController>(UserVocabularyWordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
