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
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Vocabulary Words')
@Controller('vocabularies/:vocabularyId/words')
export class UserVocabularyWordController {
    constructor(private readonly wordService: UserVocabularyWordService) {}

    @Post()
    @ApiOperation({ summary: 'Create a word in specific vocabulary' })
    @ApiParam({
        name: 'vocabularyId',
        type: Number,
        description: 'Vocabulary ID',
    })
    @ApiBody({ type: CreateUserVocabularyWordDto })
    create(
        @Param('vocabularyId', ParseIntPipe) vocabularyId: number,
        @Body() createDto: CreateUserVocabularyWordDto
    ) {
        return this.wordService.create(vocabularyId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all words (debug purpose)' })
    findAll() {
        return this.wordService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get word by ID' })
    @ApiParam({ name: 'id', type: Number })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.wordService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update word by ID' })
    @ApiParam({ name: 'id', type: Number })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateUserVocabularyWordDto
    ) {
        return this.wordService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete word by ID' })
    @ApiParam({ name: 'id', type: Number })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.wordService.remove(id);
    }

    @Post(':id/test')
    @ApiOperation({ summary: 'Test user answer for a word' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ schema: { properties: { answer: { type: 'string' } } } })
    testAnswer(
        @Param('id', ParseIntPipe) id: number,
        @Body('answer') answer: string
    ) {
        return this.wordService.testAnswer(id, answer);
    }
}
