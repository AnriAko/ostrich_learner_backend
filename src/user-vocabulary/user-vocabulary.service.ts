import { Injectable } from '@nestjs/common';
import { CreateUserVocabularyDto } from './dto/create-user-vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user-vocabulary.dto';

@Injectable()
export class UserVocabularyService {
  create(createUserVocabularyDto: CreateUserVocabularyDto) {
    return 'This action adds a new userVocabulary';
  }

  findAll() {
    return `This action returns all userVocabulary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVocabulary`;
  }

  update(id: number, updateUserVocabularyDto: UpdateUserVocabularyDto) {
    return `This action updates a #${id} userVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVocabulary`;
  }
}
