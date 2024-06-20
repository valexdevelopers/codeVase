import { IsString, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RefreshLoginAdminDto {

    @ApiProperty()
    @IsString()
    @IsEmpty()
    refresh: string
}
