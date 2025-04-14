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

@Controller('user-vocabulary')
export class UserVocabularyController {
    constructor(
        private readonly userVocabularyService: UserVocabularyService
    ) {}

    @Post()
    create(@Body() dto: CreateUserVocabularyDto) {
        return this.userVocabularyService.create(dto);
    }

    @Get()
    findAll() {
        return this.userVocabularyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userVocabularyService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserVocabularyDto) {
        return this.userVocabularyService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userVocabularyService.remove(+id);
    }
}
