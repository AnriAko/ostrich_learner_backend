import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabularyWordsService } from './user-vocabulary-words.service';

describe('UserVocabularyWordsService', () => {
  let service: UserVocabularyWordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVocabularyWordsService],
    }).compile();

    service = module.get<UserVocabularyWordsService>(UserVocabularyWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
