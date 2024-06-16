import {IsEmail, IsNotEmpty} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsNotEmpty()
    password:string
}