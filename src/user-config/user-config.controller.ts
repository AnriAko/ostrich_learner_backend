import { Controller, Patch, Param, Body } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InterfaceLanguage } from './enums/interface-language.enum';
import { Theme } from './enums/theme.enum';

@ApiTags('User Config')
@Controller('user-config')
export class UserConfigController {
    constructor(private readonly userConfigService: UserConfigService) {}

    @ApiOperation({ summary: 'Update the nickname of a user' })
    @ApiResponse({ status: 200, description: 'Nickname updated successfully.' })
    @ApiResponse({ status: 404, description: 'UserConfig not found.' })
    @Patch(':userId/nickname')
    updateNickname(
        @Param('userId') userId: string,
        @Body('nickname') nickname: string
    ) {
        return this.userConfigService.updateNickname(userId, nickname);
    }

    @ApiOperation({ summary: 'Update the language of a user' })
    @ApiResponse({ status: 200, description: 'Language updated successfully.' })
    @ApiResponse({ status: 404, description: 'UserConfig not found.' })
    @Patch(':userId/language')
    updateLanguage(
        @Param('userId') userId: string,
        @Body('language') language: InterfaceLanguage
    ) {
        return this.userConfigService.updateLanguage(userId, language);
    }

    @ApiOperation({ summary: 'Update the theme of a user' })
    @ApiResponse({ status: 200, description: 'Theme updated successfully.' })
    @ApiResponse({ status: 404, description: 'UserConfig not found.' })
    @Patch(':userId/theme')
    updateTheme(@Param('userId') userId: string, @Body('theme') theme: Theme) {
        return this.userConfigService.updateTheme(userId, theme);
    }
}
