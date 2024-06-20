import {IsEmail, IsNotEmpty, IsString} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {

    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password:string
}