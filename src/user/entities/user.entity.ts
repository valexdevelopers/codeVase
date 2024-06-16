import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

export class User {


    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    fullname: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    profile_image?: string

    @IsString()
    @IsNotEmpty()
    refreshToken: string


}
