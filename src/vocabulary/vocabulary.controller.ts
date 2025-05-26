import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-vocabulary.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('User Vocabulary')
@Controller('vocabularies')
export class VocabularyController {
    constructor(private readonly vocabularyService: VocabularyService) {}

    @Post()
    @ApiOperation({ summary: 'Create a vocabulary for a user' })
    create(@Body() dto: CreateVocabularyDto) {
        return this.vocabularyService.createVocabulary(dto);
    }

    @Get()
    @ApiOperation({ summary: `Get all vocabularies for a user` })
    findAll(@Query('userId') userId: string) {
        return this.vocabularyService.findAllByUser(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single user vocabulary by ID' })
    @ApiParam({ name: 'id', type: String })
    findOne(@Param('id') id: string) {
        return this.vocabularyService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user vocabulary by ID' })
    @ApiParam({ name: 'id', type: String })
    update(@Param('id') id: string, @Body() dto: UpdateUserVocabularyDto) {
        return this.vocabularyService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user vocabulary by ID' })
    @ApiParam({ name: 'id', type: String })
    remove(@Param('id') id: string) {
        return this.vocabularyService.remove(id);
    }
}
