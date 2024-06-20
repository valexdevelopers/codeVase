import { IsString, IsEnum, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Level } from '../../enums/level.enum';

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    challenge: string

    @IsNotEmpty()
    @IsEnum(Level, {
        message: 'Level must be one of the following values: easy, heard, medium',
    })
    level: Level

    @IsString()
    @IsNotEmpty()
    @IsIn(['javascript', 'python', 'java', 'csharp', 'ruby', 'php']) // Example languages
    languages: string;

    
}


