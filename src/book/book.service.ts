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

@Injectable()
export class BookService implements OnModuleDestroy {
    private readonly dbName = 'ostrich_learner';
    private readonly collectionName = 'books';

    constructor(
        private readonly mongoClient: MongoClient,
        @Inject('MONGO_URI') private readonly mongoUri: string
    ) {}

    async onModuleDestroy() {
        await this.mongoClient.close();
    }

    private getCollection(): Collection {
        return this.mongoClient.db(this.dbName).collection(this.collectionName);
    }

    async findAllByUser(userId: string) {
        const collection = this.getCollection();
        return collection.find({ userId }).project({ p: 0 }).toArray();
    }

    async findPagesByBookId(id: string, page = 1, pageSize = 5) {
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

        return {
            title: book.b,
            totalPages: book.p_count,
            currentPage: page,
            pageSize,
            pages: book.p,
        };
    }

    async updateBookByUser(id: string, _userId: string, updateDto: any) {
        const collection = this.getCollection();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateDto }
        );

        if (result.matchedCount === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        return { modifiedCount: result.modifiedCount };
    }

    async deleteOneByUser(id: string, _userId: string) {
        const collection = this.getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        return { deleted: true };
    }
    /*-------------------Creation With Python Via uploading PDF-------------------*/
    async createBookWithPdf(pdfBuffer: Buffer, userId: string) {
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
