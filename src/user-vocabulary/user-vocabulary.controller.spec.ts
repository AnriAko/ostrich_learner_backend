import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabularyController } from './user-vocabulary.controller';
import { UserVocabularyService } from './user-vocabulary.service';

describe('UserVocabularyController', () => {
  let controller: UserVocabularyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVocabularyController],
      providers: [UserVocabularyService],
    }).compile();

    controller = module.get<UserVocabularyController>(UserVocabularyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
