import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { InterfaceLanguage } from 'src/user-config/enums/interface-language.enum';
import { Theme } from 'src/user-config/enums/theme.enum';

export class CreateUserDto {
    // @ApiProperty({
    //     description: 'The email of the user',
    //     example: 'user@example.com',
    // })
    // @IsNotEmpty()
    // @IsEmail()
    // email: string;

    // @ApiProperty({
    //     description: 'The password of the user',
    //     example: 'password123',
    // })
    // @IsNotEmpty()
    // password: string;

    @ApiProperty({
        description: 'The nickname of the user',
        example: 'JohnDoe',
    })
    @IsNotEmpty()
    nickname: string;

    @ApiProperty({
        description: 'The language preference for the user interface',
        enum: InterfaceLanguage,
        default: InterfaceLanguage.English,
    })
    @IsEnum(InterfaceLanguage)
    interfaceLanguage: InterfaceLanguage;

    @ApiProperty({
        description: 'The theme preference for the user',
        enum: Theme,
        default: Theme.Light,
    })
    @IsEnum(Theme)
    theme: Theme;
}
