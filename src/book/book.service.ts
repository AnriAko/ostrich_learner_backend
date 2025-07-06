import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException,
    OnModuleDestroy,
    Inject,
} from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
import { MongoClient, ObjectId, Collection } from 'mongodb';
import { WordService } from 'src/word/word.service';
import { BookType } from './types/book.type';
import { PageType } from './types/page.type';

@Injectable()
export class BookService implements OnModuleDestroy {
    private readonly dbName = 'ostrich_learner';
    private readonly collectionName = 'books';

    constructor(
        private readonly mongoClient: MongoClient,
        @Inject('MONGO_URI') private readonly mongoUri: string,
        private readonly wordService: WordService
    ) {}

    async onModuleDestroy() {
        await this.mongoClient.close();
    }

    public getCollection(): Collection<BookType> {
        return this.mongoClient
            .db(this.dbName)
            .collection<BookType>(this.collectionName);
    }

    async findAllByUser(userId: string): Promise<Omit<BookType, 'p'>[]> {
        const collection = this.getCollection();
        return collection
            .find({ userId })
            .project<Omit<BookType, 'p'>>({ p: 0 })
            .sort({ lastRead: -1, _id: -1 })
            .toArray();
    }

    async findAllByUserPaginated(
        userId: string,
        page: number = 1,
        pageSize: number = 15
    ): Promise<{ data: Omit<BookType, 'p'>[]; total: number }> {
        const collection = this.getCollection();

        const total = await collection.countDocuments({ userId });

        const data = await collection
            .find({ userId })
            .project<Omit<BookType, 'p'>>({ p: 0 })
            .sort({ lastRead: -1, _id: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return { data, total };
    }

    async findPagesByBookId(
        id: string,
        page = 1,
        pageSize = 5
    ): Promise<{
        title: string;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        pages: PageType[];
    }> {
        if (pageSize > 10) {
            throw new BadRequestException('pageSize cannot be greater than 10');
        }

        const skip = (page - 1) * pageSize;
        const collection = this.getCollection();

        const projection = {
            p: { $slice: [skip, pageSize] },
            b: 1,
            p_count: 1,
        };

        const book = await collection.findOne(
            { _id: new ObjectId(id) },
            { projection }
        );

        if (!book) throw new NotFoundException(`Book with id ${id} not found`);

        await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    lastRead: new Date(),
                    lastViewedPage: page,
                    lastViewedPageSize: pageSize,
                },
            }
        );

        const pages = await this.lazyCleanupInvalidTranslations(book.p);

        return {
            title: book.b,
            totalPages: book.p_count,
            currentPage: page,
            pageSize,
            pages,
        };
    }

    private async lazyCleanupInvalidTranslations(
        pages: PageType[]
    ): Promise<PageType[]> {
        const allTranslationIds = pages.flatMap(
            (page) => page.tr?.map((tr) => tr.translation_id) ?? []
        );

        const uniqueIds = [...new Set(allTranslationIds)];

        const existingWords = await this.wordService.findManyByIds(uniqueIds);
        const validIds = new Set(existingWords.map((w) => w.id));

        return pages.map((page) => {
            if (!page.tr) return page;
            const filteredTranslations = page.tr.filter((tr) =>
                validIds.has(tr.translation_id)
            );
            return { ...page, tr: filteredTranslations };
        });
    }

    async updateBookTitle(id: string, _userId: string, newTitle: string) {
        const collection = this.getCollection();

        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    b: newTitle,
                },
            }
        );

        if (updateResult.matchedCount === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        const updatedBook = await collection.findOne(
            { _id: new ObjectId(id) },
            { projection: { p: 0 } }
        );

        if (!updatedBook) {
            throw new NotFoundException(
                `Book with id ${id} not found after update`
            );
        }

        return updatedBook;
    }

    async deleteOneBookByUser(id: string, _userId: string) {
        const collection = this.getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        return { deleted: true };
    }

    /*-------------------Creation With Python Via uploading PDF-------------------*/
    async createBookWithPdf(
        pdfBuffer: Buffer,
        userId: string
    ): Promise<Omit<BookType, 'p'>> {
        const result = await this.runPdfProcessing(
            pdfBuffer,
            userId,
            this.mongoUri,
            'pdf_to_json_stream.exe',
            this.dbName,
            this.collectionName
        );

        const match = result.output.match(/_id:\s*([a-f\d]{24})/i);
        if (!match) {
            throw new InternalServerErrorException(
                'Unable to extract book ID from output'
            );
        }

        const insertedId = match[1];
        const collection = this.getCollection();
        const book = await collection.findOne(
            { _id: new ObjectId(insertedId) },
            { projection: { p: 0 } }
        );

        if (!book) {
            throw new InternalServerErrorException(
                'Book not found after creation'
            );
        }

        return book;
    }

    private runPdfProcessing(
        pdfBuffer: Buffer,
        userId: string,
        mongoUri: string,
        exeFileName: string,
        dbName: string,
        collectionName: string
    ): Promise<{ output: string }> {
        const exePath = join(
            process.cwd(),
            'src',
            'book',
            'utils',
            'pdf_to_json',
            exeFileName
        );

        return new Promise((resolve, reject) => {
            const process = spawn(
                exePath,
                [userId, mongoUri, dbName, collectionName],
                { stdio: ['pipe', 'pipe', 'pipe'] }
            );

            let output = '';
            let errorOutput = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            process.on('error', (err) => {
                reject(
                    new InternalServerErrorException(
                        `Process error: ${err.message}`
                    )
                );
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve({ output });
                } else {
                    reject(
                        new InternalServerErrorException(
                            `Error during PDF processing: ${errorOutput}`
                        )
                    );
                }
            });

            process.stdin.write(pdfBuffer);
            process.stdin.end();
        });
    }
}
