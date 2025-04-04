import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { CreateUserConfigDto } from './dto/create-user-config.dto';
import { UpdateUserConfigDto } from './dto/update-user-config.dto';

@Controller('user-config')
export class UserConfigController {
  constructor(private readonly userConfigService: UserConfigService) {}

  @Post()
  create(@Body() createUserConfigDto: CreateUserConfigDto) {
    return this.userConfigService.create(createUserConfigDto);
  }

  @Get()
  findAll() {
    return this.userConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userConfigService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserConfigDto: UpdateUserConfigDto) {
    return this.userConfigService.update(+id, updateUserConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userConfigService.remove(+id);
  }
}
