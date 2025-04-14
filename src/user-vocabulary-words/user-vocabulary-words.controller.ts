import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { UserVocabularyWordService } from './user-vocabulary-words.service';
import { CreateUserVocabularyWordDto } from './dto/create-user-vocabulary-word.dto';
import { UpdateUserVocabularyWordDto } from './dto/update-user-vocabulary-word.dto';

@Controller('vocabularies/:vocabularyId/words')
export class UserVocabularyWordController {
    constructor(private readonly wordService: UserVocabularyWordService) {}

    @Post()
    create(
        @Param('vocabularyId', ParseIntPipe) vocabularyId: number,
        @Body() createDto: CreateUserVocabularyWordDto
    ) {
        return this.wordService.create(vocabularyId, createDto);
    }

    @Get()
    findAll() {
        return this.wordService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.wordService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateUserVocabularyWordDto
    ) {
        return this.wordService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.wordService.remove(id);
    }

    @Post(':id/test')
    testAnswer(
        @Param('id', ParseIntPipe) id: number,
        @Body('answer') answer: string
    ) {
        return this.wordService.testAnswer(id, answer);
    }
}
