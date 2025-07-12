import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FullUserProfileDto } from './dto/full-user-profile.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
        status: 201,
        description: 'The user has been created successfully.',
    })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of all users.' })
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'The user was found.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @ApiOperation({ summary: 'Get full user profile by ID' })
    @ApiResponse({ status: 200, type: FullUserProfileDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get('profile/:id')
    getProfile(@Param('id') id: string): Promise<FullUserProfileDto> {
        return this.userService.getFullProfileById(id);
    }

    @ApiOperation({ summary: 'Update user nickname' })
    @ApiResponse({ status: 200, description: 'Nickname updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Patch(':id/nickname')
    updateNickname(@Param('id') id: string, @Body() dto: UpdateNicknameDto) {
        return this.userService.updateNickname(id, dto);
    }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'The user was deleted.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Delete(':id')
    delete(@Param('id') userId: string) {
        return this.userService.delete(userId);
    }
}
