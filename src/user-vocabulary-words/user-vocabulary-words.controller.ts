import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserVocabularyWordsService } from './user-vocabulary-words.service';
import { CreateUserVocabularyWordDto } from './dto/create-user-vocabulary-word.dto';
import { UpdateUserVocabularyWordDto } from './dto/update-user-vocabulary-word.dto';

@Controller('user-vocabulary-words')
export class UserVocabularyWordsController {
  constructor(private readonly userVocabularyWordsService: UserVocabularyWordsService) {}

  @Post()
  create(@Body() createUserVocabularyWordDto: CreateUserVocabularyWordDto) {
    return this.userVocabularyWordsService.create(createUserVocabularyWordDto);
  }

  @Get()
  findAll() {
    return this.userVocabularyWordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userVocabularyWordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserVocabularyWordDto: UpdateUserVocabularyWordDto) {
    return this.userVocabularyWordsService.update(+id, updateUserVocabularyWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVocabularyWordsService.remove(+id);
  }
}
