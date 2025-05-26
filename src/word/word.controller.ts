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
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Vocabulary Words')
@Controller('words')
export class WordController {
    constructor(private readonly wordService: WordService) {}

    @Post()
    @ApiOperation({ summary: 'Create a word in specific vocabulary' })
    @ApiBody({ type: CreateWordDto })
    create(@Body() createDto: CreateWordDto) {
        return this.wordService.create(createDto);
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
}
