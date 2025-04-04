import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabularyService } from './user-vocabulary.service';

describe('UserVocabularyService', () => {
  let service: UserVocabularyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVocabularyService],
    }).compile();

    service = module.get<UserVocabularyService>(UserVocabularyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
