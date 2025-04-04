import { Injectable } from '@nestjs/common';
import { CreateUserLearningLanguageDto } from './dto/create-user-learning-language.dto';
import { UpdateUserLearningLanguageDto } from './dto/update-user-learning-language.dto';

@Injectable()
export class UserLearningLanguageService {
  create(createUserLearningLanguageDto: CreateUserLearningLanguageDto) {
    return 'This action adds a new userLearningLanguage';
  }

  findAll() {
    return `This action returns all userLearningLanguage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userLearningLanguage`;
  }

  update(id: number, updateUserLearningLanguageDto: UpdateUserLearningLanguageDto) {
    return `This action updates a #${id} userLearningLanguage`;
  }

  remove(id: number) {
    return `This action removes a #${id} userLearningLanguage`;
  }
}
