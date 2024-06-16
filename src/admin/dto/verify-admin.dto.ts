import {IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAdminDto {

    @ApiProperty()
    @IsString()
    token: string
}
