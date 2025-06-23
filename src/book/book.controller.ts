import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { UploadPdfDto } from './dto/upload-pdf.dto';

@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService,
        private readonly configService: ConfigService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createSimple(
        @UploadedFile() file: Express.Multer.File,
        @Body() createBookDto: UploadPdfDto
    ) {
        const mongoUri = this.configService.get<string>('MONGO_URI');
        return this.bookService.createSimple(
            file.buffer,
            createBookDto.userId,
            mongoUri!
        );
    }

    @Get()
    findAll() {
        return this.bookService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookService.remove(+id);
    }
}
