import { IsString, IsEnum, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Status } from '../../enums/status.enum';

export class CreateTaskAttemptDto {

    @IsString()
    @IsNotEmpty()
    challenge: string;

    @IsString()
    @IsOptional()
    user_code?: string

    @IsString()
    @IsOptional()
    code_stdin?: string

    @IsString()
    @IsOptional()
    code_execution_result?: string

    @IsNotEmpty()
    @IsEnum(Status, {
        message: 'status must be successful or unsuccessful',
    })
    status: Status

}


