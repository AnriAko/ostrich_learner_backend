import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { DatabaseModule } from '../database/database.module';
import { WordModule } from 'src/word/word.module';

@Module({
    imports: [DatabaseModule, WordModule],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService],
})
export class BookModule {}
