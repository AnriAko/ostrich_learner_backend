import { Test, TestingModule } from '@nestjs/testing';
import { UserLearningLanguageService } from './user-learning-language.service';

describe('UserLearningLanguageService', () => {
  let service: UserLearningLanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLearningLanguageService],
    }).compile();

    service = module.get<UserLearningLanguageService>(UserLearningLanguageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
