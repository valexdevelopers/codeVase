import {IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserDto {

    @ApiProperty()
    @IsString()
    token: string
}
