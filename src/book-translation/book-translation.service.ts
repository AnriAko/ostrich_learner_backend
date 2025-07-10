import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
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

        if (!word || !word.id) {
            throw new InternalServerErrorException('Failed to create word');
        }

        // Step 2: Ensure page exists
        const collection = this.bookService.getCollection();

        const book = await collection.findOne(
            { _id: new ObjectId(bookId) },
            { projection: { [`p.${pageIndex}`]: 1 } }
        );

        if (!book?.p || !book.p[pageIndex]) {
            throw new NotFoundException(
                `Page with index ${pageIndex} not found in book`
            );
        }

        // Step 3: Push translation to that page
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(bookId) },
            {
                $push: {
                    [`p.${pageIndex}.tr`]: {
                        pos_id: posId,
                        translation_id: word.id,
                        origin: word.origin,
                        translation: word.translation,
                        sourceLang: createWordDto.sourceLang,
                        targetLang: createWordDto.targetLang,
                    },
                } as PushOperator<any>,
            }
        );

        if (updateResult.modifiedCount === 0) {
            throw new NotFoundException(
                `Book or page not found or not modified`
            );
        }

        return word;
    }

    async deleteTranslationFromBook(
        bookId: string,
        dto: DeleteTranslationDto
    ): Promise<{ deleted: boolean }> {
        const { pageIndex, translationId } = dto;

        await this.wordService.remove(translationId);

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
