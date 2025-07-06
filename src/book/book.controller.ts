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
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { Express } from 'express';
import { UploadPdfDto } from './dto/upload-pdf.dto';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createSimple(
        @UploadedFile() file: Express.Multer.File,
        @Body() createBookDto: UploadPdfDto
    ) {
        return this.bookService.createBookWithPdf(
            file.buffer,
            createBookDto.userId
        );
    }

    @Get('user/:userId')
    async findAllByUserPaginated(
        @Param('userId') userId: string,
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '15'
    ) {
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const pageSizeNum = Math.min(50, parseInt(pageSize, 10) || 15); // ограничим максимум

        return this.bookService.findAllByUserPaginated(
            userId,
            pageNum,
            pageSizeNum
        );
    }

    @Get(':id')
    async findPagesByBook(
        @Param('id') id: string,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '5'
    ) {
        return this.bookService.findPagesByBookId(
            id,
            parseInt(page, 10),
            parseInt(pageSize, 10)
        );
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateDto: any,
        @Query('userId') userId: string
    ) {
        return this.bookService.updateBookByUser(id, userId, updateDto);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string, @Query('userId') userId: string) {
        return this.bookService.deleteOneBookByUser(id, userId);
    }
}
