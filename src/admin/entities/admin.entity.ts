import { IsEmail, IsOptional, IsNotEmpty, Length, IsDate, IsString, IsStrongPassword } from 'class-validator';


export class Admin {

    @IsString()
    @IsNotEmpty()
    id: string

    @IsEmail()
    @Length(6, 100)
    email: string

    
    @Length(2, 50)
    @IsNotEmpty()
    fullname: string

    // @IsOptional()
    // @IsDate()
    // email_verified_at?: Date

    @IsString()
    @IsNotEmpty()
    refreshToken: string

}


