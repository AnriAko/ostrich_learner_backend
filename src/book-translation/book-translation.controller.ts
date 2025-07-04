import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { BookTranslationService } from './book-translation.service';
import { AddTranslationDto } from './dto/add-translation.dto';
import { DeleteTranslationDto } from './dto/delete-translation.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('book-translation')
@Controller('book-translation')
export class BookTranslationController {
    constructor(
        private readonly bookTranslationService: BookTranslationService
    ) {}

    @Post(':bookId/word')
    @ApiOperation({ summary: 'Add a translation word to a book page' })
    @ApiParam({ name: 'bookId', description: 'ID of the book' })
    @ApiBody({ type: AddTranslationDto })
    async addTranslation(
        @Param('bookId') bookId: string,
        @Body() addTranslationDto: AddTranslationDto
    ) {
        return this.bookTranslationService.addTranslationToBook(
            bookId,
            addTranslationDto
        );
    }

    @Delete(':bookId/word')
    @ApiOperation({ summary: 'Delete a translation word from a book page' })
    @ApiParam({ name: 'bookId', description: 'ID of the book' })
    @ApiBody({ type: DeleteTranslationDto })
    async deleteTranslation(
        @Param('bookId') bookId: string,
        @Body() deleteTranslationDto: DeleteTranslationDto
    ) {
        return this.bookTranslationService.deleteTranslationFromBook(
            bookId,
            deleteTranslationDto
        );
    }
}
