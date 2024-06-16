import { IsEmail, IsStrongPassword, IsOptional, IsNotEmpty, Length, IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty()
    @IsEmail()
    @Length(6, 100)
    email: string

    @ApiProperty()
    @Length(2, 50)
    @IsNotEmpty()
    fullname: string


    @ApiProperty()
    @Length(10, 16)
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string

    @IsOptional()
    @IsString()
    profile_image: string

    @IsOptional()
    @IsDate()
    email_verified_at?: Date

    @IsOptional()
    @IsDate()
    created_at?: Date

    @IsOptional()
    @IsDate()
    deleted_at?: Date

}
