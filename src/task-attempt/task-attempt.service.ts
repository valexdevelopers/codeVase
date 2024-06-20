import { Injectable } from '@nestjs/common';
import { CreateTaskAttemptDto } from './dto/create-task-attempt.dto';
import { UpdateTaskAttemptDto } from './dto/update-task-attempt.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { NewTaskAttemptDto } from './dto/new-task-attempt.dto';

@Injectable()
export class TaskAttemptService {
  create(createTaskAttemptDto: NewTaskAttemptDto) {
    // const newTask: Prisma.TaskAttemptsCreateInput = {
    //   user: {
    //     connect: { id: createTaskAttemptDto.user }
    //   },
    //   challenge: {
    //     connect: { id: createTaskAttemptDto.challenge }
    //   },
    //   user_code: createTaskAttemptDto.user_code,
    //   code_stdin: createTaskAttemptDto.code_stdin,
    //   code_execution_result: createTaskAttemptDto.code_execution_result,
    //   status: createTaskAttemptDto.status
    // }
    // const createTask = await this.databaseService.challenge.create({ data: newTask });

    // if (!createTask) {
    //   throw new InternalServerErrorException("Internal server error! could not create task", {
    //     cause: new Error(),
    //     description: "server error"
    //   })
    // }

    return true
  }

  findAll() {
    return `This action returns all taskAttempt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskAttempt`;
  }

  update(id: number, updateTaskAttemptDto: UpdateTaskAttemptDto) {
    return `This action updates a #${id} taskAttempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskAttempt`;
  }
}
