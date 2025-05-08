import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
//change it later !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
@ApiTags('Users')
@Controller('users')
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

    // @ApiOperation({ summary: 'Update user data' })
    // @ApiResponse({ status: 200, description: 'The user was updated.' })
    // @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.userService.update(id, updateUserDto);
    // }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'The user was deleted.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
