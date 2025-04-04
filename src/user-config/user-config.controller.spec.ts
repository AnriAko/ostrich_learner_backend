import { Test, TestingModule } from '@nestjs/testing';
import { UserConfigController } from './user-config.controller';
import { UserConfigService } from './user-config.service';

describe('UserConfigController', () => {
  let controller: UserConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConfigController],
      providers: [UserConfigService],
    }).compile();

    controller = module.get<UserConfigController>(UserConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
