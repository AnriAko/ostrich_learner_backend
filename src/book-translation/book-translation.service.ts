import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BookService } from 'src/book/book.service';
import { WordService } from 'src/word/word.service';
import { AddTranslationDto } from './dto/add-translation.dto';
import { DeleteTranslationDto } from './dto/delete-translation.dto';
import { PushOperator } from 'mongodb';
import { Word } from 'src/word/entities/word.entity';

@Injectable()
export class BookTranslationService {
    constructor(
        private readonly bookService: BookService,
        private readonly wordService: WordService
    ) {}

    async addTranslationToBook(
        bookId: string,
        dto: AddTranslationDto
    ): Promise<Word> {
        const { pageIndex, posId, createWordDto } = dto;

        // Step 1: Add word to SQL
        const word = await this.wordService.create(createWordDto);

        // Step 2: Add translation to MongoDB page
        const collection = this.bookService.getCollection();

        const updateResult = await collection.updateOne(
            { _id: new ObjectId(bookId) },
            {
                $push: {
                    [`p.${pageIndex}.tr`]: {
                        pos_id: posId,
                        translation_id: word.id,
                        origin: word.origin,
                        translation: word.translation,
                    },
                } as PushOperator<any>,
            }
        );

        if (updateResult.modifiedCount === 0) {
            throw new NotFoundException(`Book or page not found`);
        }

        return word;
    }

    async deleteTranslationFromBook(
        bookId: string,
        dto: DeleteTranslationDto
    ): Promise<{ deleted: boolean }> {
        const { pageIndex, translationId } = dto;

        // Step 1: Delete from SQL
        await this.wordService.remove(translationId);

        // Step 2: Delete from MongoDB
        const collection = this.bookService.getCollection();

        const pullQuery: Record<string, any> = {};
        pullQuery[`p.${pageIndex}.tr`] = { translation_id: translationId };

        const updateResult = await collection.updateOne(
            { _id: new ObjectId(bookId) },
            { $pull: pullQuery }
        );

        if (updateResult.modifiedCount === 0) {
            throw new NotFoundException(`Translation not found in book`);
        }

        return { deleted: true };
    }
}
