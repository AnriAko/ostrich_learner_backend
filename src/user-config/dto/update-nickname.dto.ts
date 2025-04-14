import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateNicknameDto {
    @ApiProperty({ description: 'The new nickname of the user.' })
    @IsNotEmpty()
    nickname: string;
}
