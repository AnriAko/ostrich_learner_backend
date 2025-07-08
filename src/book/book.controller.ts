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
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { Express, Request } from 'express';
import { UpdateBookTitleDto } from './dto/update-book-title';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createSimple(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        const { userId, fileName } = req.body;

        return this.bookService.createBookWithPdf(
            file.buffer,
            userId,
            fileName
        );
    }

    @Get('user/:userId')
    async findAllByUserPaginated(
        @Param('userId') userId: string,
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '15'
    ) {
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const pageSizeNum = Math.min(50, parseInt(pageSize, 10) || 15);

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

    @Patch(':id/title')
    async updateBookTitle(
        @Param('id') id: string,
        @Body() dto: UpdateBookTitleDto,
        @Query('userId') userId: string
    ) {
        return this.bookService.updateBookTitle(id, userId, dto.title);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string, @Query('userId') userId: string) {
        return this.bookService.deleteOneBookByUser(id, userId);
    }
}
