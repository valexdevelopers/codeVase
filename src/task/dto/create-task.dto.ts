import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['javascript', 'python', 'java', 'csharp', 'ruby', 'php']) // Example languages
    language: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
