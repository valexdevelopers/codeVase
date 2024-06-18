import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class Task {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    challenge: string

    @IsString()
    @IsNotEmpty()
    challenge_answer: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['javascript', 'python', 'java', 'csharp', 'ruby', 'php']) // Example languages
    languages: string;


}


