import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Request,
} from '@nestjs/common';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { WordFilterDto } from './dto/word-filter.dto';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { Word } from './entities/word.entity';
import { TestResultDto } from './dto/test-result.dto';

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

    @Patch(':id')
    @ApiOperation({ summary: 'Update word by ID' })
    @ApiParam({ name: 'id', type: Number })
    update(@Param('id') id: number, @Body() updateDto: UpdateWordDto) {
        return this.wordService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete word by ID' })
    @ApiParam({ name: 'id', type: Number })
    remove(@Param('id') id: number) {
        return this.wordService.remove(id);
    }

    @Post(':id/check-answer')
    @ApiOperation({ summary: 'Check user answer for a word with 3 states' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        schema: {
            properties: {
                origin: { type: 'string' },
                answer: { type: 'string' },
                isReversed: { type: 'boolean' },
                userId: { type: 'string' },
            },
            required: ['origin', 'answer', 'isReversed', 'userId'],
        },
    })
    checkAnswer(
        @Param('id') id: number,
        @Body('origin') origin: string,
        @Body('translation') translation: string,
        @Body('userId') userId: string
    ) {
        return this.wordService.checkAnswer(id, origin, translation, userId);
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
    @ApiParam({ name: 'userId', type: 'string' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'pageSize', required: false })
    getByUser(
        @Param('userId') userId: string,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '20'
    ) {
        return this.wordService.findByUser(userId, +page, +pageSize);
    }

    @Get('/user/:userId/learning-stats')
    @ApiOperation({ summary: 'Get daily learning stats for user (calendar)' })
    @ApiParam({ name: 'userId', type: 'string' })
    getUserLearningStats(@Param('userId') userId: string) {
        return this.wordService.getLearningStatsByDay(userId);
    }

    @Get('/available-for-learning/:userId')
    @ApiOperation({ summary: 'Get words available for learning for user' })
    @ApiParam({ name: 'userId', type: 'string' })
    getAvailableForLearning(@Param('userId') userId: string) {
        return this.wordService.getAvailableForLearning(userId);
    }

    @Get('/available-for-repetition/:userId')
    @ApiOperation({ summary: 'Get words available for repetition for user' })
    @ApiParam({ name: 'userId', type: 'string' })
    getAvailableForRepetition(@Param('userId') userId: string) {
        return this.wordService.getAvailableForRepetitionTestWords(userId);
    }

    @Get('filtered')
    @ApiOperation({ summary: 'Filter words for authenticated user' })
    async getFilteredWords(
        @Query() filters: WordFilterDto
    ): Promise<{ data: Word[]; total: number }> {
        const { items, total } = await this.wordService.findFiltered(
            filters.userId,
            filters
        );
        return { data: items, total };
    }

    @Post('process-test-results')
    async processTestResults(@Body() results: TestResultDto[]) {
        await this.wordService.processTestResults(results);
        return { success: true };
    }

    @Get('by-id/:id')
    @ApiOperation({ summary: 'Get word by ID' })
    @ApiParam({ name: 'id', type: Number })
    findOne(@Param('id') id: number) {
        return this.wordService.findOne(id);
    }
}
