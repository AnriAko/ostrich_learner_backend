import { IsString, IsUUID } from 'class-validator';

export class UpdateBookTitleDto {
    @IsUUID('4')
    userId: string;
    @IsString()
    title: string;
}
