import { IsEmail, IsInt, IsNotEmpty, Length, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {

    @ApiProperty()
    @IsEmail()
    @Length(6, 100)
    email: string

    @ApiProperty()
    @Length(2, 50)
    @IsNotEmpty()
    fullname: string


    @ApiProperty()
    @Length(10, 20)
    @IsNotEmpty()
    password: string

    @IsDate()
    email_verified_at: Date

    @ApiProperty()
    @IsDate()
    created_at: Date

    @ApiProperty()
    @IsDate()
    deleted_at: Date

}
