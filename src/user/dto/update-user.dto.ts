import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'user@example.com',
        required: false,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123',
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
