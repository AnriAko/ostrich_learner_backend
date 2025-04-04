import { Test, TestingModule } from '@nestjs/testing';
import { UserLearningLanguageController } from './user-learning-language.controller';
import { UserLearningLanguageService } from './user-learning-language.service';

describe('UserLearningLanguageController', () => {
  let controller: UserLearningLanguageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLearningLanguageController],
      providers: [UserLearningLanguageService],
    }).compile();

    controller = module.get<UserLearningLanguageController>(UserLearningLanguageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
