import { IsUUID } from 'class-validator';

export class UploadPdfDto {
    @IsUUID('4')
    userId: string;
}
