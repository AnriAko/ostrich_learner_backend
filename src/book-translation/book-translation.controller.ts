import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { BookTranslationService } from './book-translation.service';
import { AddTranslationDto } from './dto/add-translation.dto';
import { DeleteTranslationDto } from './dto/delete-translation.dto';

@Controller('book-translation')
export class BookTranslationController {
    constructor(
        private readonly bookTranslationService: BookTranslationService
    ) {}

    @Post(':bookId/word')
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
