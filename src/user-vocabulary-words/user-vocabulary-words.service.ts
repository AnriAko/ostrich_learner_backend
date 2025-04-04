import { Injectable } from '@nestjs/common';
import { CreateUserVocabularyWordDto } from './dto/create-user-vocabulary-word.dto';
import { UpdateUserVocabularyWordDto } from './dto/update-user-vocabulary-word.dto';

@Injectable()
export class UserVocabularyWordsService {
  create(createUserVocabularyWordDto: CreateUserVocabularyWordDto) {
    return 'This action adds a new userVocabularyWord';
  }

  findAll() {
    return `This action returns all userVocabularyWords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVocabularyWord`;
  }

  update(id: number, updateUserVocabularyWordDto: UpdateUserVocabularyWordDto) {
    return `This action updates a #${id} userVocabularyWord`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVocabularyWord`;
  }
}
