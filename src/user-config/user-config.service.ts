import { Injectable } from '@nestjs/common';
import { CreateUserConfigDto } from './dto/create-user-config.dto';
import { UpdateUserConfigDto } from './dto/update-user-config.dto';

@Injectable()
export class UserConfigService {
  create(createUserConfigDto: CreateUserConfigDto) {
    return 'This action adds a new userConfig';
  }

  findAll() {
    return `This action returns all userConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userConfig`;
  }

  update(id: number, updateUserConfigDto: UpdateUserConfigDto) {
    return `This action updates a #${id} userConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} userConfig`;
  }
}
