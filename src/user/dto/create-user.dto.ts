import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'user@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123',
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'The nickname of the user',
        example: 'JohnDoe',
    })
    @IsNotEmpty()
    nickname: string;
}
