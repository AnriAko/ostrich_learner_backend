import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';

@Injectable()
export class BookService {
    async createSimple(pdfBuffer: Buffer, userId: string, mongoUri: string) {
        return this.runPdfProcessing(
            pdfBuffer,
            userId,
            mongoUri,
            'pdf_to_json_stream.exe'
        );
    }

    private runPdfProcessing(
        pdfBuffer: Buffer,
        userId: string,
        mongoUri: string,
        exeFileName: string
    ) {
        const exePath = join(
            process.cwd(),
            'src',
            'book',
            'utils',
            'pdf_to_json',
            exeFileName
        );
        console.log('EXE path:', exePath);

        return new Promise((resolve, reject) => {
            const process = spawn(exePath, [userId, mongoUri], {
                stdio: ['pipe', 'pipe', 'pipe'],
            });

            let output = '';
            let errorOutput = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            process.on('error', (err) => {
                console.error('Process error:', err);
                reject(
                    new InternalServerErrorException(
                        `Process error: ${err.message}`
                    )
                );
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve({ message: 'PDF saved', output });
                } else {
                    reject(
                        new InternalServerErrorException(
                            `Error during working on pdf exe: ${errorOutput}`
                        )
                    );
                }
            });

            process.stdin.write(pdfBuffer);
            process.stdin.end();
        });
    }

    findAll() {
        return `This action returns all book`;
    }

    findOne(id: number) {
        return `This action returns a #${id} book`;
    }

    update(id: number, updateBookDto: any) {
        return `This action updates a #${id} book`;
    }

    remove(id: number) {
        return `This action removes a #${id} book`;
    }
}
