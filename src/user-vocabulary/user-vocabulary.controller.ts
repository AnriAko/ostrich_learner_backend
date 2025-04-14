import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UserVocabularyService } from './user-vocabulary.service';
import { CreateUserVocabularyDto } from './dto/create-user-vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user-vocabulary.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('User Vocabulary')
@Controller('users/:userId/vocabularies')
export class UserVocabularyController {
    constructor(
        private readonly userVocabularyService: UserVocabularyService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a vocabulary for a user' })
    @ApiParam({
        name: 'userId',
        description: 'User ID to associate the vocabulary with',
    })
    create(
        @Param('userId') userId: string,
        @Body() dto: CreateUserVocabularyDto
    ) {
        return this.userVocabularyService.createForUser(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user vocabularies' })
    findAll() {
        return this.userVocabularyService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single user vocabulary by ID' })
    findOne(@Param('id') id: string) {
        return this.userVocabularyService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user vocabulary by ID' })
    update(@Param('id') id: string, @Body() dto: UpdateUserVocabularyDto) {
        return this.userVocabularyService.update(+id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user vocabulary by ID' })
    remove(@Param('id') id: string) {
        return this.userVocabularyService.remove(+id);
    }
}
