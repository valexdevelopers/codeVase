import { IsString, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RefreshLoginUserDto {

    @ApiProperty()
    @IsString()
    @IsEmpty()
    refresh: string
}
