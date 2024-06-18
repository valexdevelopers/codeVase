import { Injectable } from '@nestjs/common';
import { NewTaskDto } from './dto/new-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class TaskService {
    create(createTaskDto: NewTaskDto) {

        const newTask: Prisma.ChallengeCreateInput = {
            admin: {
                connect: { id: createTaskDto.admin_id } 
            },
            title: createTaskDto.title,
            description: createTaskDto.description,
            challenge: createTaskDto.challenge,
            level: createTaskDto.level,
            challenge_answer: createTaskDto.challenge_answer,
            languages: createTaskDto.languages
        }
        return 'This action adds a new task';
    }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
