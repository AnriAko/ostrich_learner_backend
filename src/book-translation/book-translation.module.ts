import { Module } from '@nestjs/common';
import { BookTranslationService } from './book-translation.service';
import { BookTranslationController } from './book-translation.controller';
import { BookModule } from 'src/book/book.module';
import { WordModule } from 'src/word/word.module';

@Module({
    imports: [BookModule, WordModule],
    controllers: [BookTranslationController],
    providers: [BookTranslationService],
})
export class BookTranslationModule {}
