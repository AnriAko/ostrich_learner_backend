import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserLearningLanguageService } from './user-learning-language.service';
import { CreateUserLearningLanguageDto } from './dto/create-user-learning-language.dto';
import { UpdateUserLearningLanguageDto } from './dto/update-user-learning-language.dto';

@Controller('user-learning-language')
export class UserLearningLanguageController {
  constructor(private readonly userLearningLanguageService: UserLearningLanguageService) {}

  @Post()
  create(@Body() createUserLearningLanguageDto: CreateUserLearningLanguageDto) {
    return this.userLearningLanguageService.create(createUserLearningLanguageDto);
  }

  @Get()
  findAll() {
    return this.userLearningLanguageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLearningLanguageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserLearningLanguageDto: UpdateUserLearningLanguageDto) {
    return this.userLearningLanguageService.update(+id, updateUserLearningLanguageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLearningLanguageService.remove(+id);
  }
}
