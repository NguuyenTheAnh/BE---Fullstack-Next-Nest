import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'name', 'email'] as const) {
    @IsMongoId()
    _id: string

    @IsOptional()
    name: string
}

