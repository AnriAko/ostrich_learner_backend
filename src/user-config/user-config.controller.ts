import { Controller, Patch, Param, Body } from '@nestjs/common';
import { UserConfigService } from './user-config.service';

@Controller('user-config')
export class UserConfigController {
    constructor(private readonly userConfigService: UserConfigService) {}

    @Patch(':userId/nickname')
    updateNickname(
        @Param('userId') userId: string,
        @Body('nickname') nickname: string
    ) {
        return this.userConfigService.updateNickname(userId, nickname);
    }
}
