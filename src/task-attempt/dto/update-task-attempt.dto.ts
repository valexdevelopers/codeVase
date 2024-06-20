import { PartialType } from '@nestjs/swagger';
import { CreateTaskAttemptDto } from './create-task-attempt.dto';

export class UpdateTaskAttemptDto extends PartialType(CreateTaskAttemptDto) {}
