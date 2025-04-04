import { PartialType } from '@nestjs/mapped-types';
import { CreateUserConfigDto } from './create-user-config.dto';

export class UpdateUserConfigDto extends PartialType(CreateUserConfigDto) {}
