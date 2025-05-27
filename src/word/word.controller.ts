import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('Vocabulary Words')
@Controller('word')
export class WordController {
    constructor(private readonly wordService: WordService) {}

    @Post()
    @ApiOperation({ summary: 'Create a word in specific vocabulary' })
    @ApiBody({ type: CreateWordDto })
    create(@Body() createDto: CreateWordDto) {
        return this.wordService.create(createDto);
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
        @Body() updateDto: UpdateWordDto
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

    @Get('/vocabulary/:vocabularyId')
    @ApiOperation({ summary: 'Get words by vocabulary with pagination' })
    @ApiParam({ name: 'vocabularyId', type: 'string' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'pageSize', required: false })
    getByVocabulary(
        @Param('vocabularyId') vocabularyId: string,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '20'
    ) {
        return this.wordService.findByVocabulary(
            vocabularyId,
            +page,
            +pageSize
        );
    }

    @Get('/user/:userId')
    @ApiOperation({ summary: 'Get words by user with pagination' })
    @ApiParam({ name: 'userId', type: Number })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'pageSize', required: false })
    getByUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '20'
    ) {
        return this.wordService.findByUser(userId, +page, +pageSize);
    }

    @Get('/user/:userId/learning-stats')
    @ApiOperation({ summary: 'Get daily learning stats for user (calendar)' })
    @ApiParam({ name: 'userId', type: Number })
    getUserLearningStats(@Param('userId', ParseIntPipe) userId: number) {
        return this.wordService.getLearningStatsByDay(userId);
    }
    @Get('/vocabulary/:vocabularyId/available-for-learning')
    @ApiOperation({
        summary:
            'Get words available for learning (memoryScore = 0 or no learningDate)',
    })
    @ApiParam({ name: 'vocabularyId', type: 'string' })
    getAvailableForLearning() {
        return this.wordService.getAvailableForTestWords();
    }

    @Get('/vocabulary/:vocabularyId/available-for-repetition')
    @ApiOperation({
        summary:
            'Get words available for repetition (based on dateForRepetition)',
    })
    @ApiParam({ name: 'vocabularyId', type: 'string' })
    getAvailableForRepetition() {
        return this.wordService.getAvailableForRepetitionTestWords();
    }
}
